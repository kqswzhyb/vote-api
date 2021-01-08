"use strict";

module.exports = {
  Query: {
    // 查询单个
    file(root, { id }, ctx) {
      return ctx.connector.file.fetchById(id);
    },
  },
  Mutation: {
  },
};
