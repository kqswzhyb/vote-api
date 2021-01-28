const moment = require("moment");
const { Op } = require("Sequelize");
const { calcVoteCountSimple } = require("../utils/scheduleFn");

module.exports = {
  schedule: {
    interval: "1m", // 1 分钟间隔
    type: "all", // 指定所有的 worker 都需要执行
    immediate: true,
  },
  async task(ctx) {
    //获取到期场次
    const res = await ctx.app.model.Round.findAll({
      where: {
        status: "0",
        endTime: {
          [Op.lte]: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      },
      include: [
        {
          attributes: ["id", "voteId"],
          as: "roundStage",
          model: ctx.app.model.RoundStage,
          include:[
            {
              attributes: ["id"],
              as: "vote",
              model: ctx.app.model.Vote,
              include:[
                {
                  attributes: ["id", "voteId","showChart"],
                  as: "voteConfig",
                  model: ctx.app.model.VoteConfig,
                },
              ]
            }
          ]
        },
        {
          as: "roundRole",
          model: ctx.app.model.RoundRole,
        },
      ],
    });

    const data = res.map((v) => v.toJSON());

    data.forEach(async (v, i) => {
      let transaction;
      try {
        transaction = await ctx.model.transaction();
        //计算票数
        await calcVoteCountSimple(ctx, v, transaction);
        //获取该场次所有角色
        const result = await ctx.app.model.RoundRole.findAll({
          where: {
            roundId: {
              [Op.eq]: v.id,
            },
          },
        });
        const resultData = result
          .map((v) => v.toJSON())
          .sort((a, b) => b.totalCount - a.totalCount);
        //确定晋级角色
        await ctx.app.model.RoundRole.update(
          { isPromotion: "1" },
          {
            where: {
              id: {
                [Op.eq]: resultData[0].id,
              },
            },
            transaction,
          }
        );
        //场次状态变为结束
        await ctx.app.model.Round.update(
          { status: "1" },
          {
            where: {
              id: {
                [Op.eq]: v.id,
              },
            },
            transaction,
          }
        );
        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
      }
    });
  },
};
