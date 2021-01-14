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

  fetch(id) {
    const vote = this.ctx.app.model.Vote.findAll({
      where: {
        id,
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
          as: "voteRole",
          model: this.ctx.app.model.VoteRole,
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
        {
          as: "roundStage",
          model: this.ctx.app.model.RoundStage,
          include: [
            {
              as: "round",
              model: this.ctx.app.model.Round,
              include: [
                {
                  as: "roundRole",
                  model: this.ctx.app.model.RoundRole,
                  include: [
                    {
                      as: "voteRole",
                      model: this.ctx.app.model.VoteRole,
                    },
                  ],
                },
              ],
            },
          ],
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
          as: "voteRole",
          model: this.ctx.app.model.VoteRole,
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

  /**
   * 更新到就绪状态
   */
  async readyVote(data, ctx) {
    const userId = getOperator(ctx);
    const { id } = data;
    const vote = await ctx.connector.vote.fetchById(id);
    const voteJSON = vote.toJSON();
    if (voteJSON.status === "8") {
      return {
        code: "1033",
        message: "状态已过期，无法就绪",
      };
    }
    let obj = {};
    voteJSON.voteRoleType.forEach((v) => {
      obj[v.id] = 0;
    });
    voteJSON.voteRole.forEach((v) => {
      obj[v.roleTypeId] += 1;
    });
    if (voteJSON.voteType === "0") {
      return testResult(
        Object.values(obj).every((v) => v >= 2),
        ctx,
        id,
        userId,
        voteJSON
      );
    }

    if (voteJSON.voteType === "1") {
      if (voteJSON.specialType === "128") {
        return testResult(
          Object.values(obj).every((v) => v === 128),
          ctx,
          id,
          userId,
          voteJSON
        );
      }
      if (voteJSON.specialType === "64") {
        return testResult(
          Object.values(obj).every((v) => v === 64),
          ctx,
          id,
          userId,
          voteJSON
        );
      }
    }
  }
}

async function testResult(res, ctx, id, userId, data) {
  if (res) {
    let transaction;
    try {
      transaction = await ctx.model.transaction();
      if (data.voteType === "0") {
        const roundStageId = UUID.v4().replace(/-/g, "");
        const roundId = UUID.v4().replace(/-/g, "");
        await ctx.connector.roundStage.createRoundStage({ input: {
          id:roundStageId,
          parentId: "-1",
          voteId: data.id,
          roleTypeId: data.voteRoleType[0].id,
          name: "正赛",
          startTime: data.startTime,
          endTime: data.endTime,
          totalCount: data.voteRole.length,
          promotionCount: 1,
        }, transaction }, ctx)
        await ctx.connector.round.createRound({ input: {
          id:roundId,
          roundStageId,
          parentId: "-1",
          roundName: "正赛A组",
          groupName:'A组',
          startTime: data.startTime,
          endTime: data.endTime,
        }, transaction }, ctx)
        await ctx.connector.roundRole.batchCreateRole({ arr: data.voteRole.map(v=>({
          id:UUID.v4().replace(/-/g, ""),
          roundId,
          roleId:v.id,
          isPromotion: "0",
          normalCount: 0,
          specialCount: 0,
          totalCount: 0,
        })), transaction }, ctx)
      }
      await ctx.app.model.Vote.update(
        { updateBy: userId, status: "7" },
        {
          where: { id },
        }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      return {
        code: "500",
        message: err,
      };
    }
    return {
      code: "0",
      message: "成功",
    };
  } else {
    return {
      code: "1032",
      message: "角色不足，无法就绪",
    };
  }
}

module.exports = VoteConnector;
