const Service = require("egg").Service;
const errorMap = require("../graphql/utils/errorMap");

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
      include: [
        {
          as: "userInvitateCode",
          model: this.ctx.app.model.UserInvitateCode,
        },
        {
          as: "role",
          model: this.ctx.app.model.Role,
          include: [
            {
              as: "roleMenu",
              model: this.ctx.app.model.RoleMenu,
              include: [
                {
                  as: "menu",
                  model: this.ctx.app.model.Menu,
                },
              ],
            },
          ],
        },
      ],
    });
    if (!user) {
      return {
        code: "1000",
        message: errorMap["1000"],
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