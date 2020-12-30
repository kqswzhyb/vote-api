const Service = require("egg").Service;
const moment = require("moment");

class AuthService extends Service {
  // 登录
  async login(data) {
    const { ctx, app } = this;
    const current = new Date();
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
        code: 1000,
        message: "用户不存在",
      };
    }
    const token = app.jwt.sign(
      Object.assign({}, data, {
        iat: moment(current).format("YYYY-MM-DD HH:mm:ss"),
        exp: moment(current).add(60,'minutes').format("YYYY-MM-DD HH:mm:ss")
      }),
      app.config.jwt.secret,
      {
        expiresIn: "60m", // 时间根据自己定，具体可参考jsonwebtoken插件官方说明
      }
    );
    return {
      code: 0,
      message: "成功",
      data: token,
    };
  }
}
module.exports = AuthService;
