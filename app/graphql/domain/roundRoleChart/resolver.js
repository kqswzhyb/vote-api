"use strict";

module.exports = {
  Query: {
    // 查询单个
    roundRoleChart(root, { id }, ctx) {
      return ctx.connector.roundRoleChart.fetchById(id);
    },
  },
  Mutation: {},
};
