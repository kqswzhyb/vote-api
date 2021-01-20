"use strict";

module.exports = {
  Query: {
    // 查询单个
    roundStage(root, { id }, ctx) {
      return ctx.connector.roundStage.fetchById(id);
    },
  },
  Mutation: {},
};
