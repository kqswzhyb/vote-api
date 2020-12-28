'use strict';

module.exports = {
  Query: {
    // 查询单个用户邀请码
    userInvitateCode(root, { id }, ctx) {
      return ctx.connector.userInvitateCode.fetchById(id);
    },
    // 查询多个用户邀请码
    userInvitateCodes(root, { id }, ctx) {
      return ctx.connector.userInvitateCode.fetchByIds(id);
    },
    // 查询所有用户邀请码
    userInvitateCodeList(root, data, ctx) {
      return ctx.connector.userInvitateCode.fetchList(data);
    },
  },
};
