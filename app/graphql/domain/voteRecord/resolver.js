"use strict";

module.exports = {
  Query: {
    // 查询单个
    voteRecord(root, { id }, ctx) {
      return ctx.connector.voteRecord.fetchById(id);
    },
    // 查询所有
    voteRecordList(root, data, ctx) {
      return ctx.connector.voteRecord.fetchList(data);
    },
    // 查询总数
    voteRecordCount(root, data, ctx) {
        return ctx.connector.voteRecord.fetchCount(data);
      },
  },
  Mutation: {
    //创建
    createVoteRecord(root, data, ctx) {
      return ctx.connector.voteRecord.createVoteRecord(data, ctx);
    },
    //批量创建
    batchCreateVoteRecord(root, data, ctx) {
      return ctx.connector.voteRecord.batchCreateVoteRecord(data, ctx);
    },
    //更新
    updateVoteRecord(root, data, ctx) {
      return ctx.connector.voteRecord.updateVoteRecord(data, ctx);
    },
    //删除
    deleteVoteRecord(root, data, ctx) {
        return ctx.connector.voteRecord.deleteVoteRecord(data);
      },
  },
};
