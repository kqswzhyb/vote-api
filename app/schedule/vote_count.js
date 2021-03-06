const {calcVoteCount} = require('../utils/scheduleFn')

module.exports = {
  schedule: {
    interval: "1m", // 1 分钟间隔
    type: "all", // 指定所有的 worker 都需要执行
    immediate: true,
  },
  async task(ctx) {
    calcVoteCount(ctx,'1')
  },
};
