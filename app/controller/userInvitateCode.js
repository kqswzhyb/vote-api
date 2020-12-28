'use strict';

module.exports = (app) => {
  class UserInvitateCodeController extends app.Controller {
    async create() {
      const { ctx } = this;
      const createRule = {
        // username: { type: 'string' },
        // password: { type: 'string' },
      };
      // 校验参数
      ctx.validate(createRule);

      await ctx.model.UserInvitateCode.create(ctx.request.body);
      ctx.body = {
        code: 0,
        message: 'success',
      };
    }
  }
  return UserInvitateCodeController;
};
