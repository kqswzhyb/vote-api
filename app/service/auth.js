const Service = require("egg").Service;
const moment = require('moment');

class AuthService extends Service {
  // 登录
  async login(data) {
    const { ctx, app } = this;
    const current = new Date().getTime();
    const createRule = {
      username: {
        type: "string",
      },
      qqOpenId: {
        type: "string",
      },
    };
    // 校验参数
    ctx.validate(createRule);

    const user = await ctx.model.User.findOne({
      where: data,
    });
    if (!user) {
      return {
        code: "1000",
        message: "用户不存在",
      };
    }
    const token = app.jwt.sign(
      Object.assign({}, data, {
        iat: current
      }),
      app.config.jwt.secret,
      {
        expiresIn: "60m", // 时间根据自己定，具体可参考jsonwebtoken插件官方说明
      }
    );
    ctx.app.model.User.update({lastLoginTime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}, { where: data})
    ctx.service.redis.set(data.username,token,60*60*1000);

    return {
      code: "0",
      message: "成功",
      data: token,
    };
  }
}
module.exports = AuthService;
