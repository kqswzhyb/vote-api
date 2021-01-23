const moment = require("moment");
const { Op } = require("Sequelize");

module.exports = {
  schedule: {
    interval: "1m", // 1 分钟间隔
    type: "all", // 指定所有的 worker 都需要执行
  },
  //待开始转进行中
  async task(ctx) {
    let now = new Date().getTime();
    const res = await ctx.app.model.Vote.findAll({
      where: {
        status: "4",
      },
    });

    const data = res.map((v) => v.toJSON());

    let times = [];
    data.forEach(async (v) => {
      if (moment(v.startTime).valueOf() <= now) {
        times.push(v.id);
        const result = (
          await ctx.app.model.UserFollow.findAll({
            where: {
              followId: v.id,
              followType: "0",
            },
            include: [
              {
                as: "vote",
                model: ctx.app.model.Vote,
              },
            ],
          })
        ).map((item) => item.toJSON());
        await ctx.connector.userMessage.batchCreateUserMessage(
          {
            arr: result.map((item) => ({
              userId: item.userId,
              title: "系统消息",
              content: `您关注的比赛 《${item.vote.voteName}》 正在进行中！`,
              url: `/moe/${item.followId}`,
              status: "0",
            })),
          },
          ctx
        );
        const nsp = ctx.app.io.of('/');
        result.forEach(item=>{
          nsp.sockets[item.userId].emit('message', 'has new');
        })
      }
    });
    if (times.length) {
      await ctx.app.model.Vote.update(
        { status: "5" },
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
