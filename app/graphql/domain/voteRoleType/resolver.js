'use strict';

module.exports = {
  Query: {
    // 查询单个
    voteRoleType(root, { id }, ctx) {
      return ctx.connector.voteRoleType.fetchById(id);
    },
    // 查询所有
    voteRoleTypeList(root, data, ctx) {
        console.log(ctx.connector.voteRoleType)
      return ctx.connector.voteRoleType.fetchList(data);
    },
  },
  Mutation: {
    //创建
    createVoteRoleType(root, data, ctx) {
      return ctx.connector.voteRoleType.createVoteRoleType(data,ctx);
    },
    //更新
    updateVoteRoleType(root, data, ctx) {
      return ctx.connector.voteRoleType.updateVoteRoleType(data,ctx);
    },
    //删除
    deleteVoteRoleType(root, data, ctx) {
      return ctx.connector.voteRoleType.deleteVoteRoleType(data);
    },
  }
};
