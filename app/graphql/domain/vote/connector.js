"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");
const UUID = require("uuid");

class VoteConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const vote = this.ctx.app.model.Vote.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          as: "voteConfig",
          model: this.ctx.app.model.VoteConfig,
          include: [
            {
              as: "file",
              model: this.ctx.app.model.File,
            },
          ],
        },
        {
          as: "voteRoleType",
          model: this.ctx.app.model.VoteRoleType,
        },
      ],
    });
    return new Promise((resolve, reject) => {
      vote.then((res) => {
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
    return this.ctx.app.model.Vote.findAll({
      where: {
        ...handleFilter(filter),
      },
      include: [
        {
          as: "voteConfig",
          model: this.ctx.app.model.VoteConfig,
          include: [
            {
              as: "file",
              model: this.ctx.app.model.File,
            },
          ],
        },
        {
          as: "voteRoleType",
          model: this.ctx.app.model.VoteRoleType,
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
    const count = await this.ctx.app.model.Vote.count({
      where: {
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
  async createVote(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    const voteId = UUID.v4().replace(/-/g, "");
    let configInput = input.configInput;
    configInput.voteId = voteId;
    let roleInput = input.roleInput;
    roleInput.forEach((v) => {
      v.voteId = voteId;
      v.createBy = id;
      v.updateBy = id;
    });
    let transaction;
    let vote;
    try {
      transaction = await ctx.model.transaction();
      vote = await this.ctx.app.model.Vote.create(
        {
          id: voteId,
          ...input,
          createBy: id,
          updateBy: id,
        },
        {
          transaction,
        }
      );
      await ctx.connector.voteConfig.createVoteConfig(
        { input: configInput, transaction },
        ctx
      );
      await ctx.connector.voteRoleType.batchCreateVoteRoleType(
        { arr: roleInput, transaction },
        ctx
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
    return vote;
  }

  /**
   * 更新
   */
  async updateVote(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    let configInput = input.configInput;
    let roleInput = input.roleInput;
    roleInput.forEach((v) => {
      v.voteId = id;
      v.createBy = userId;
      v.updateBy = userId;
    });
    let transaction;
    let res;
    try {
      transaction = await ctx.model.transaction();
      res = await this.ctx.app.model.Vote.update(
        Object.assign({}, input, { updateBy: userId }),
        {
          where: { id },
          transaction,
        }
      );
      await ctx.connector.voteConfig.updateVoteConfig(
        { input: configInput, id, transaction },
        ctx
      );
      await ctx.connector.voteRoleType.deleteVoteRoleTypeByVote(
        { id, transaction },
        ctx
      );
      await ctx.connector.voteRoleType.batchCreateVoteRoleType(
        { arr: roleInput, transaction },
        ctx
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
    return res[0] == 1 ? this.fetchById(id) : null;
  }
}

module.exports = VoteConnector;
