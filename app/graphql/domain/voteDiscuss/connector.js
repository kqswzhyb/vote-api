"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");
const { Op } = require("Sequelize");

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
          attributes: ["id", "voteId", "userId", "content"],
          as: "voteDiscuss",
          model: this.ctx.app.model.VoteDiscuss,
        },
        {
          attributes: ["nickname"],
          as: "user",
          model: this.ctx.app.model.User,
          include: [
            {
              attributes: ["fileFullPath"],
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
  async fetchList(data) {
    let id;
    try {
      id = getOperator(this.ctx);
    } catch (err) {
      id = null;
    }
    const { page = {}, filter = {} } = data;
    const voteDiscuss = (
      await this.ctx.app.model.VoteDiscuss.findAll({
        where: {
          status: "0",
          ...handleFilter(filter),
        },
        include: [
          {
            attributes: ["id", "voteId", "userId", "content"],
            as: "voteDiscuss",
            model: this.ctx.app.model.VoteDiscuss,
          },
          {
            attributes: ["nickname"],
            as: "user",
            model: this.ctx.app.model.User,
            include: [
              {
                attributes: ["fileFullPath"],
                as: "file",
                model: this.ctx.app.model.File,
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: page.limit || 10,
        offset: page.offset || 0,
      })
    ).map((v) => v.toJSON());
    //如果有id,同时把标识带出来
    if (id) {
      const voteDiscussSignal = (
        await this.ctx.app.model.VoteDiscussSignal.findAll({
          where: {
            status: "0",
            voteDiscussId: {
              [Op.in]: voteDiscuss.map((v) => v.id),
            },
            userId: id,
          },
          order: [["updatedAt", "DESC"]],
        })
      ).map((v) => v.toJSON());
      voteDiscussSignal.forEach((v) => {
        const index = voteDiscuss.findIndex(
          (item) => item.id === v.voteDiscussId
        );
        voteDiscuss[index].signalType = v.signalType;
      });
    }
    return voteDiscuss;
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
    const count = await this.ctx.app.model.VoteDiscuss.count({
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
  async createVoteDiscuss(data, ctx) {
    const id = getOperator(ctx);
    const { input = {}, transaction = null } = data;
    const maxFloor = await this.ctx.app.model.VoteDiscuss.max("floor", {
      where: {
        voteId: input.voteId,
      },
    });
    input.floor = !maxFloor ? 1 : input.replyId === "-1" ? maxFloor + 1 : 0;
    const result = (
      await this.ctx.app.model.VoteDiscuss.create(
        {
          ...input,
          createBy: id,
          updateBy: id,
        },
        { transaction }
      )
    ).toJSON();
    return this.fetchById(result.id);
  }

  /**
   * 批量创建
   */
  batchCreateVoteDiscuss(data, ctx) {
    const { arr = [], transaction = null } = data;
    return this.ctx.app.model.VoteDiscuss.bulkCreate(arr, { transaction });
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
