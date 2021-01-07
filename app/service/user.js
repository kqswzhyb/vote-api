const Service = require("egg").Service;
const errorMap = require("../graphql/utils/errorMap");
const { getOperator } = require("../graphql/utils/util");

class UserService extends Service {
  // 个人信息
  async info() {
    const { ctx } = this;
    const id = getOperator(ctx);
    const user = await ctx.model.User.findOne({
      where: { id },
      include: [
        {
          as: "userInvitateCode",
          model: this.ctx.app.model.UserInvitateCode,
        },
        {
          as: "role",
          model: this.ctx.app.model.Role,
          attributes: ['id','name'],
          include: [
            {
              as: "roleMenu",
              model: this.ctx.app.model.RoleMenu,
              attributes: ['id'],
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
