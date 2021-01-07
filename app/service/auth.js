const Service = require("egg").Service;
const moment = require("moment");
const errorMap = require("../graphql/utils/errorMap");
const { getOperator } = require("../graphql/utils/util");

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
        code: "1000",
        message: errorMap["1000"],
      };
    }
    const token = app.jwt.sign(
      Object.assign({}, user.dataValues, {
        iat: current.getTime(),
      }),
      app.config.jwt.secret,
      {
        expiresIn: "60m", // 时间根据自己定，具体可参考jsonwebtoken插件官方说明
      }
    );
    ctx.app.model.User.update(
      { lastLoginTime: moment(current).format("YYYY-MM-DD HH:mm:ss") },
      { where: data }
    );
    ctx.service.redis.set(user.id, token, 60 * 60 * 1000);

    return {
      code: "0",
      message: "成功",
      data: token,
    };
  }

  // 注销登录
  async logout() {
    const { ctx } = this;
    let id = getOperator(ctx);
    ctx.service.redis.del(id);

    return {
      code: "0",
      message: "成功",
    };
  }
}
module.exports = AuthService;
