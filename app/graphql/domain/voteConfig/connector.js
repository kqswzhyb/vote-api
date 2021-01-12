"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");
const UUID = require("uuid");

class VoteConfigConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const voteConfig = this.ctx.app.model.VoteConfig.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          as: "file",
          model: this.ctx.app.model.File,
        },
      ],
    });
    return new Promise((resolve, reject) => {
      voteConfig.then((res) => {
        res.length ? resolve(res) : resolve([{}]);
      });
    });
  }

  /**
   * 查询所有
   * @returns {*}
   */
  fetchList(data) {
    const { page = {}, filter = {} } = data;
    return this.ctx.app.model.VoteConfig.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      include: [
        {
          as: "file",
          model: this.ctx.app.model.File,
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 创建
   */
  async createVoteConfig(data, ctx) {
    const id = getOperator(ctx);
    const { input = {}, transaction = null } = data;
    const voteConfigId = UUID.v4().replace(/-/g, "");
    if (input.file && input.file.fileName) {
      await this.ctx.app.model.File.create(
        {
          recordId: voteConfigId,
          fileName: input.file.fileName,
          filePath: input.file.filePath,
          fileExt: input.file.fileExt,
          fileFullPath:
            input.file.filePath +
            "/" +
            input.file.fileName +
            "." +
            input.file.fileExt,
          createBy: id,
          updateBy: id,
        },
        {
          transaction,
        }
      );
    }
    delete input.file;
    return this.ctx.app.model.VoteConfig.create(
      {
        id: voteConfigId,
        ...input,
        createBy: id,
        updateBy: id,
      },
      { transaction }
    );
  }

  /**
   * 更新
   */
  async updateVoteConfig(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id, transaction = null } = data;
    await this.ctx.app.model.File.destroy({
      where: {
        recordId: input.voteConfigId,
      },
      transaction,
    });
    if (input.file) {
      await this.ctx.app.model.File.create(
        {
          recordId: input.voteConfigId,
          fileName: input.file.fileName,
          filePath: input.file.filePath,
          fileExt: input.file.fileExt,
          fileFullPath:
            input.file.filePath +
            "/" +
            input.file.fileName +
            "." +
            input.file.fileExt,
          createBy: userId,
          updateBy: userId,
        },
        {
          transaction,
        }
      );
    }
    delete input.file;
    delete input.voteConfigId;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteConfig.update(
        Object.assign({}, input, { updateBy: userId }),
        {
          where: { voteId: id },
          transaction,
        }
      ).then((res) => {
        resolve(null);
      });
    });
  }
}

module.exports = VoteConfigConnector;
