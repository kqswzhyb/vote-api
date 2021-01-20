const moment = require("moment");
const { Op } = require("Sequelize");

module.exports = {
  schedule: {
    cron: '0 10 23 * * *',
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    //获取到期场次
    const res = await ctx.app.model.Round.findAll({
      where: {
        status: "1",
        endTime: {
          [Op.gte]: moment()
            .subtract(15, "minutes")
            .format("YYYY-MM-DD HH:mm:ss"),
          [Op.lte]: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        parentId: {
          [Op.ne]: "-1",
        },
      },
      include: [
        {
          as: "roundRole",
          model: ctx.app.model.RoundRole,
        },
      ],
    });

    const data = res.map((v) => v.toJSON());
    let transaction;
    try {
      transaction = await ctx.model.transaction();
      data.forEach(async (v) => {
        //获取该场次晋级角色
        const result = await ctx.app.model.RoundRole.findAll({
          where: {
            roundId: {
              [Op.eq]: v.id,
            },
            isPromotion: "1",
          },
        });
        const resultData = result.map((v) => v.toJSON());
        //晋级角色创建下一轮
        await ctx.app.model.RoundRole.create(
          {
            roundId: v.parentId,
            roleId: resultData[0].roleId,
            isPromotion: "0",
            normalCount: 0,
            specialCount: 0,
            totalCount: 0,
          },
          { transaction }
        );
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
};
