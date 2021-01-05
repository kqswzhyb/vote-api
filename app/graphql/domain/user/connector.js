"use strict";

const moment = require("moment");
const { handleFilter, getOperator } = require("../../utils/util.js");

class UserConnector {
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * 查询所有
   * @returns {*}
   */
  fetchList(data) {
    const { page = {}, filter = {} } = data;
    return this.ctx.app.model.User.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      include: [
        {
          as: "userInvitateCode",
          model: this.ctx.app.model.UserInvitateCode,
        },
        {
          as: "role",
          model: this.ctx.app.model.Role,
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
  }

  /**
   * 查询单个
   * @param id
   * @returns {Promise<V> | Promise.<V>}
   */
  fetchById(id) {
    return this.ctx.app.model.User.findOne({
      where: {
        status: "0",
        id,
      },
      include: [
        {
          as: "userInvitateCode",
          model: this.ctx.app.model.UserInvitateCode,
        },
        {
          as: "role",
          model: this.ctx.app.model.Role,
        },
      ],
    });
  }

  /**
   * 创建用户
   */
  createUser(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.User.create({
      ...input,
      createBy: id,
      roleId: '1',
      lastLoginTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    });
  }

  /**
   * 更新用户
   */
  updateUser(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.User.update(
        Object.assign({}, input, { updateBy: userId }),
        {
          where: { id },
        }
      ).then((res) => {
        resolve(res[0] == 1 ? this.fetchById(id) : null);
      });
    });
  }

  /**
   * 删除用户
   */
  deleteUser(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.User.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: "id不存在" }
        );
      });
    });
  }
}

module.exports = UserConnector;
