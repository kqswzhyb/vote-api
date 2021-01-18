const moment = require("moment");
const { Op } = require("Sequelize");

module.exports = {
  schedule: {
    interval: "1m", // 1 分钟间隔
    type: "all", // 指定所有的 worker 都需要执行
    immediate: true,
  },
  async task(ctx) {
    //获取到期场次阶段
    const res = await ctx.app.model.RoundStage.findAll({
      where: {
        status: "0",
        endTime: {
          [Op.lte]: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    });

    const data = res.map((v) => v.toJSON());
    data.forEach(async (v) => {
      //场次阶段状态变为结束
      await ctx.app.model.RoundStage.update(
        { status: "1" },
        {
          where: {
            id: {
              [Op.eq]: v.id,
            },
          },
        }
      );
    });
  },
};
