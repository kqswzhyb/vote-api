const moment = require("moment");
const { Op } = require("Sequelize");

module.exports = {
  schedule: {
    interval: "1m", // 1 分钟间隔
    type: "all", // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    let now = new Date().getTime();
    const res = await ctx.app.model.Vote.findAll({
      where: {
        status: "0",
      },
    });

    const data = res.map((v) => v.toJSON());
    let times = [];
    data.forEach((v) => {
      if (moment(v.startTime).valueOf() <= now + 60 * 30) {
        times.push(v.id);
      }
    });
    if (times.length) {
      await ctx.app.model.Vote.update(
        { status: "8" },
        {
          where: {
            id: {
              [Op.in]: times,
            },
          },
        }
      );
    }
  }
};
