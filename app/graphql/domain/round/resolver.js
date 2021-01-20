"use strict";

module.exports = {
  Query: {
    // 查询单个
    round(root, { id }, ctx) {
      return ctx.connector.round.fetchById(id);
    },
  },
  Mutation: {},
};
