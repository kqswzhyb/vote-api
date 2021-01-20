"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");
const moment = require("moment");
const { Op } = require("Sequelize");

class VoteRecordConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const voteRecord = this.ctx.app.model.VoteRecord.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          as: "roundRole",
          model: this.ctx.app.model.RoundRole,
          include: [
            {
              as: "voteRole",
              model: this.ctx.app.model.VoteRole,
              include: [
                {
                  as: "file",
                  model: this.ctx.app.model.File,
                },
              ],
            },
          ],
        },
      ],
    });
    return new Promise((resolve, reject) => {
      voteRecord.then((res) => {
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
    return this.ctx.app.model.VoteRecord.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      include: [
        {
          as: "roundRole",
          model: this.ctx.app.model.RoundRole,
          include: [
            {
              as: "voteRole",
              model: this.ctx.app.model.VoteRole,
              include: [
                {
                  as: "file",
                  model: this.ctx.app.model.File,
                },
              ],
            },
          ],
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
    const count = await this.ctx.app.model.VoteRecord.count({
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
  async createVoteRecord(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.VoteRecord.create({
      ...input,
      createBy: id,
      updateBy: id,
    });
  }

  /**
   * 批量创建
   */
  async batchCreateVoteRecord(data, ctx) {
    let now = new Date().getTime();
    const id = getOperator(ctx);
    const qqLevel = getOperator(ctx, "qqLevel");
    const qqVip = getOperator(ctx, "qqVip");
    const { input = [] } = data;
    let count = Array.from(new Set(input.map((v) => v.voteId)));
    if (count.length !== 1) {
      return { code: "1", message: "voteId不一致" };
    }
    count = Array.from(new Set(input.map((v) => v.roundStageId)));
    if (count.length !== 1) {
      return { code: "1", message: "roundStageId不一致" };
    }
    const record = (
      await this.ctx.app.model.VoteRecord.findAll({
        where: {
          roundId: {
            [Op.between]: input.map((v) => v.roundId),
          },
        },
      })
    ).map((v) => v.toJSON());
    if (record.length) {
      return { code: "1", message: "失败，存在已投票的场次" };
    }
    const roundStage = await this.ctx.app.model.RoundStage.findOne({
      where: {
        id: input[0].roundStageId,
      },
    });
    const roundStageJson = roundStage.toJSON();
    if (moment(roundStageJson.startTime).valueOf() >= now) {
      return { code: "1", message: "失败，投票还未开始" };
    }
    if (moment(roundStageJson.endTime).valueOf() <= now) {
      return { code: "1", message: "失败，已超过投票时间" };
    }
    const vote = await this.ctx.app.model.Vote.findOne({
      where: {
        id: input[0].voteId,
      },
      include: [
        {
          as: "voteConfig",
          model: this.ctx.app.model.VoteConfig,
        },
      ],
    });
    const voteJson = vote.toJSON();
    if (voteJson.voteConfig.voteLevel > qqLevel) {
      return { code: "1", message: "失败，等级不满足条件" };
    }
    if (voteJson.voteConfig.voteQqVip !== qqVip) {
      return { code: "1", message: "失败，会员不满足条件" };
    }
    input.forEach((v) => {
      v.userId = id;
      v.createBy = id;
      v.updateBy = id;
    });
    const result = await this.ctx.app.model.VoteRecord.bulkCreate(input);
    if (result.length === input.length) {
      return { code: "0", message: "投票成功" };
    } else {
      return { code: "1", message: "投票失败" };
    }
  }

  /**
   * 更新
   */
  async updateVoteRecord(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteRecord.update(
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
  deleteVoteRecord(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteRecord.destroy({ where: { id } }).then(
        async (res) => {
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

module.exports = VoteRecordConnector;
