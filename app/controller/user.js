"use strict";

const Controller = require("egg").Controller;

/**
 * @controller User
 */
class UserController extends Controller {
  /** 
   * @summary 个人信息
   * @description 个人信息
   * @router get /api/user/info
   * @Request header string authorization
   * @response 200 loginBody
   */
   async info(ctx)  {
    const body = await ctx.service.user.info()
    ctx.body = body
  };
}
module.exports = UserController;