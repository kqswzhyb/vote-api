"use strict";

const Controller = require("egg").Controller;

/**
 * @controller AuthController
 */
class AuthController extends Controller {
  async login(ctx) {
    const body = await ctx.service.auth.login(ctx.request.body);
    ctx.body = body;
  }
  /** 
   * @summary 退出登录
   * @description 退出登录
   * @router get /auth/logout
   * @request 
   * @response 200 JsonBody
   */
  async logout(ctx) {
    const body = await ctx.service.auth.logout(ctx.request.body);
    ctx.body = body;
  }
}
module.exports = AuthController;
