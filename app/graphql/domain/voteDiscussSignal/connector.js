"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class VoteDiscussSignalConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const voteDiscussSignal = this.ctx.app.model.VoteDiscussSignal.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      voteDiscussSignal.then((res) => {
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
    const voteDiscussSignals = this.ctx.app.model.VoteDiscussSignal.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return voteDiscussSignals;
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 创建
   */
  createVoteDiscussSignal(data, ctx) {
    const id = getOperator(ctx);
    const { input = {}, transaction = null } = data;
    return this.ctx.app.model.VoteDiscussSignal.create(
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
  batchCreateVoteDiscussSignal(data, ctx) {
    const { arr = [], transaction = null } = data;
    return this.ctx.app.model.VoteDiscussSignal.bulkCreate(arr, { transaction });
  }

  /**
   * 删除
   */
  deleteVoteDiscussSignalByVote(data, ctx) {
    const { id, transaction = null } = data;
    return this.ctx.app.model.VoteDiscussSignal.destroy({
      where: {
        voteId: id,
      },
      transaction,
    });
  }

  /**
   * 更新
   */
  updateVoteDiscussSignal(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteDiscussSignal.update(
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
  deleteVoteDiscussSignal(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteDiscussSignal.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = VoteDiscussSignalConnector;
