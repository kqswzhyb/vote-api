"use strict";

const Controller = require("egg").Controller;

/**
 * @controller Auth
 */
class AuthController extends Controller {
  /** 
   * @summary 登录
   * @description 登录
   * @router POST /api/auth/login
   * @Request body login *body
   * @response 200 loginBody
   */
  async login(ctx) {
    const body = await ctx.service.auth.login(ctx.request.body);
    ctx.body = body;
  }
  /** 
   * @summary 退出登录
   * @description 退出登录
   * @router get /api/auth/logout
   * @Request header string authorization
   * @response 200 baseBody
   */
  async logout(ctx) {
    const body = await ctx.service.auth.logout(ctx.request.body);
    ctx.body = body;
  }
}
module.exports = AuthController;
