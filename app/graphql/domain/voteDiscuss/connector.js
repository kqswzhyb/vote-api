"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class VoteDiscussConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const voteDiscuss = this.ctx.app.model.VoteDiscuss.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          as: "user",
          model: this.ctx.app.model.User,
          include: [
            {
              as: "file",
              model: this.ctx.app.model.File,
            },
          ],
        },
      ],
    });
    return new Promise((resolve, reject) => {
      voteDiscuss.then((res) => {
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
    const voteDiscusss = this.ctx.app.model.VoteDiscuss.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      include: [
        {
          as: "user",
          model: this.ctx.app.model.User,
          include: [
            {
              as: "file",
              model: this.ctx.app.model.File,
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return voteDiscusss;
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 创建
   */
  createVoteDiscuss(data, ctx) {
    const id = getOperator(ctx);
    const { input = {}, transaction = null } = data;
    return this.ctx.app.model.VoteDiscuss.create(
      {
        ...input,
        createBy: id,
        updateBy: id,
      },
      { transaction }
    );
  }

  /**
   * 批量创建
   */
  batchCreateVoteDiscuss(data, ctx) {
    const { arr = [], transaction = null } = data;
    return this.ctx.app.model.VoteDiscuss.bulkCreate(arr, { transaction });
  }

  /**
   * 删除
   */
  deleteVoteDiscussByVote(data, ctx) {
    const { id, transaction = null } = data;
    return this.ctx.app.model.VoteDiscuss.destroy({
      where: {
        voteId: id,
      },
      transaction,
    });
  }

  /**
   * 更新
   */
  updateVoteDiscuss(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteDiscuss.update(
        Object.assign({}, input, { updateBy: userId }),
        {
          where: { id },
        }
      ).then((res) => {
        resolve(res[0] == 1 ? this.fetchById(id) : null);
      });
    });
  }

  /**
   * 删除
   */
  deleteVoteDiscuss(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteDiscuss.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = VoteDiscussConnector;
