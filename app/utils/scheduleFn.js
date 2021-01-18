const moment = require("moment");
const { Op } = require("Sequelize");
//计算票数
exports.calcVoteCount = async (ctx, value = "all") => {
  return new Promise(async (resolver) => {
    let now = new Date().getTime();
    const res = await ctx.app.model.Vote.findAll({
      where: {
        status: "5",
      },
      include: [
        {
          as: "voteConfig",
          model: ctx.app.model.VoteConfig,
        },
        {
          as: "roundStage",
          model: ctx.app.model.RoundStage,
          include: [
            {
              as: "round",
              model: ctx.app.model.Round,
              include: [
                {
                  as: "roundRole",
                  model: ctx.app.model.RoundRole,
                },
              ],
            },
          ],
        },
      ],
    });
    let data = res.map((v) => v.toJSON());
    if (value !== "all") {
      data = data.filter((v) => v.voteConfig.voteUpdateType === value);
    }

    data = data
      .map((v) => v.roundStage)
      .flat()
      .map((v) => v.round)
      .flat();

    data.forEach(async (v) => {
      if (
        moment(v.startTime).valueOf() < now &&
        moment(v.endTime).valueOf() > now
      ) {
        v.roundRole.forEach(async (k) => {
          const normalCount = await ctx.app.model.VoteRecord.count({
            where: {
              voteType: { [Op.eq]: "0" },
              roundId: { [Op.eq]: v.id },
              roundRoleId: { [Op.eq]: k.id },
            },
          });
          const specialCount =
            (await ctx.app.model.VoteRecord.count({
              where: { voteType: { [Op.eq]: "1" }, roundId: { [Op.eq]: v.id } },
              roundRoleId: { [Op.eq]: k.id },
            })) * 2;
          const totalCount = normalCount + specialCount;
          await ctx.app.model.RoundRole.update(
            { normalCount, specialCount, totalCount },
            {
              where: { id: k.id },
            }
          );
        });
      }
    });
    resolver();
  });
};

//单场计算票数
exports.calcVoteCountSimple = async (ctx, row, transaction = null) => {
  return new Promise(async (resolver) => {
    row.roundRole.forEach(async (k) => {
      const normalCount = await ctx.app.model.VoteRecord.count({
        where: {
          voteType: { [Op.eq]: "0" },
          roundId: { [Op.eq]: row.id },
          roundRoleId: { [Op.eq]: k.id },
        },
      });
      const specialCount =
        (await ctx.app.model.VoteRecord.count({
          where: { voteType: { [Op.eq]: "1" }, roundId: { [Op.eq]: row.id } },
          roundRoleId: { [Op.eq]: k.id },
        })) * 2;
      const totalCount = normalCount + specialCount;
      await ctx.app.model.RoundRole.update(
        { normalCount, specialCount, totalCount },
        {
          where: { id: k.id },
          transaction,
        }
      );
    });
    resolver();
  });
};