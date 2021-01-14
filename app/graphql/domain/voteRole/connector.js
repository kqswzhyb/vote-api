"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");
const UUID = require("uuid");

class VoteRoleConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const voteRole = this.ctx.app.model.VoteRole.findAll({
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
      voteRole.then((res) => {
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
    return this.ctx.app.model.VoteRole.findAll({
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
   * 查询总数
   * @returns {*}
   */
  async fetchCount(data) {
    const { filter = {} } = data;
    const count = await this.ctx.app.model.VoteRole.count({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
    });
    return {
      total: count,
    };
  }

  /**
   * 创建
   */
  async createVoteRole(data, ctx) {
    const id = getOperator(ctx);
    const { input = {}, transaction = null } = data;
    const voteRoleId = UUID.v4().replace(/-/g, "");
    if (input.file && input.file.fileName) {
      await this.ctx.app.model.File.create(
        {
          recordId: voteRoleId,
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
    return this.ctx.app.model.VoteRole.create(
      {
        id: voteRoleId,
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
  async updateVoteRole(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id, transaction = null } = data;
    await this.ctx.app.model.File.destroy({
      where: {
        recordId: input.voteRoleId,
      },
      transaction,
    });
    if (input.file) {
      await this.ctx.app.model.File.create(
        {
          recordId: input.voteRoleId,
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
    delete input.voteRoleId;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteRole.update(
        Object.assign({}, input, { updateBy: userId }),
        {
          where: { id },
          transaction,
        }
      ).then((res) => {
        resolve(null);
      });
    });
  }

  /**
   * 删除
   */
  deleteVoteRole(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteRole.destroy({ where: { id } }).then(
        async (res) => {
          await this.ctx.app.model.File.destroy({
            where: {
              recordId: id,
            },
          });
          resolve(
            res == 1
              ? { code: "0", message: "成功" }
              : { code: "1001", message: errorMap["1001"] }
          );
        }
      );
    });
  }
}

module.exports = VoteRoleConnector;
