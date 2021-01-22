"use strict";

module.exports = {
  Follow: {
    __resolveType: (obj, ctx) => {
      if (obj.voteName) return "Vote";
      if (obj.username) return "User";
    },
  },
  Query: {
    // 查询单个
    userFollow(root, { id }, ctx) {
      return ctx.connector.userFollow.fetchById(id);
    },
    // 查询所有
    userFollowList(root, data, ctx,x) {
      return ctx.connector.userFollow.fetchList(data);
    },
    // 查询总数
    userFollowCount(root, data, ctx) {
      return ctx.connector.userFollow.fetchCount(data);
    },
  },
  Mutation: {
    //创建
    createUserFollow(root, data, ctx) {
      return ctx.connector.userFollow.createUserFollow(data, ctx);
    },
    //更新
    updateUserFollow(root, data, ctx) {
      return ctx.connector.userFollow.updateUserFollow(data, ctx);
    },
    //删除
    deleteUserFollow(root, data, ctx) {
      return ctx.connector.userFollow.deleteUserFollow(data);
    },
  },
};
