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
   * 统计标识数
   * @returns {*}
   */
  async calcCount(id) {
    const voteDiscussSignals = (
      await this.ctx.app.model.VoteDiscussSignal.findAll({
        where: {
          status: "0",
          voteDiscussId: id,
        },
        attributes: ["signalType"],
      })
    ).map((v) => v.toJSON());
    let likeCount = 0;
    let dislikeCount = 0;

    voteDiscussSignals.forEach((v) => {
      if (v.signalType === "0") {
        likeCount++;
      } else {
        dislikeCount++;
      }
    });
    return { likeCount, dislikeCount };
  }

  /**
   * 创建
   */
  async createVoteDiscussSignal(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    let transaction;
    let result;
    try {
      transaction = await ctx.model.transaction();
      await this.deleteVoteDiscussSignalByVoteDiscussId(
        { voteDiscussId: input.voteDiscussId, transaction },
        id
      );
      result = await this.ctx.app.model.VoteDiscussSignal.create(
        {
          ...input,
          userId: id,
          createBy: id,
          updateBy: id,
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
    const updateInput = await this.calcCount(input.voteDiscussId);
    await ctx.connector.voteDiscuss.updateVoteDiscuss(
      { input: updateInput, id: input.voteDiscussId },
      ctx
    );
    return result;
  }

  /**
   * 批量创建
   */
  batchCreateVoteDiscussSignal(data, ctx) {
    const { arr = [], transaction = null } = data;
    return this.ctx.app.model.VoteDiscussSignal.bulkCreate(arr, {
      transaction,
    });
  }

  /**
   * 删除
   */
  async deleteVoteDiscussSignalByVoteDiscussId(data, userId) {
    const { voteDiscussId, transaction = null } = data;
    const result = await this.ctx.app.model.VoteDiscussSignal.destroy({
      where: {
        voteDiscussId,
        userId,
      },
      transaction,
    });
    return result;
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
  async deleteVoteDiscussSignal(data, ctx) {
    const userId = getOperator(ctx);
    const { id } = data;
    let transaction;
    let result;
    try {
      transaction = await ctx.model.transaction();
      await this.deleteVoteDiscussSignalByVoteDiscussId(
        { voteDiscussId: id, transaction },
        userId
      );
      result = { code: "0", message: "成功" };
      await transaction.commit();
    } catch (err) {
      result = { code: "1", message: "失败" };
      await transaction.rollback();
    }
    const updateInput = await this.calcCount(id);
    await ctx.connector.voteDiscuss.updateVoteDiscuss(
      { input: updateInput, id },
      ctx
    );
    return result;
  }
}

module.exports = VoteDiscussSignalConnector;
