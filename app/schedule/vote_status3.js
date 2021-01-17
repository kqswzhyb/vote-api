const moment = require("moment");
const { Op } = require("Sequelize");

module.exports = {
  schedule: {
    interval: "1m", // 1 分钟间隔
    type: "all", // 指定所有的 worker 都需要执行
  },
  //进行中转已结束
  async task(ctx) {
    let now = new Date().getTime();
    const res = await ctx.app.model.Vote.findAll({
      where: {
        status: "5",
      },
    });

    const data = res.map((v) => v.toJSON());
    let times = [];
    data.forEach((v) => {
      if (moment(v.endTime).valueOf() <= now) {
        times.push(v.id);
      }
    });
    if (times.length) {
      await ctx.app.model.Vote.update(
        { status: "6" },
        {
          where: {
            id: {
              [Op.in]: times,
            },
          },
        }
      );
    }
  },
};
