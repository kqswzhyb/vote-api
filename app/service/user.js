const Service = require("egg").Service;

class UserService extends Service {
  // 个人信息
  async info() {
    const { ctx, app } = this;
    const token= ctx.request.header['authorization'].slice(7)
    let id
    try {
       const decode= ctx.app.jwt.verify(token, app.config.jwt.secret)
       id = decode.id
    }catch(err){
      return {
        code: "1",
        message: err,
      };
    }
    const user = await ctx.model.User.findOne({
      where: {id},
    });
    if (!user) {
      return {
        code: "1000",
        message: "用户不存在",
      };
    }

    return {
      code: "0",
      message: "成功",
      data: user,
    };
  }
}
module.exports = UserService;
