"use strict";

const DataLoader = require("dataloader");
const { handleFilter,getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class RoleMenuConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const roleMenu = this.ctx.app.model.RoleMenu.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      roleMenu.then((res) => {
        res.length ? resolve(res) : resolve([{}]);
      });
    });
  }

  /**
   * 查询所有
   * @returns {*}
   */
  fetchList(data) {
    const { page = {}, filter = {} } = data;
    const roleMenus = this.ctx.app.model.RoleMenu.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      include: [
        {
          as: "menu",
          model: this.ctx.app.model.Menu,
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return roleMenus;
  }

  fetchById(id) {
    return this.ctx.app.model.RoleMenu.findOne({
      where: {
        status: "0",
        id,
      },
      include: [
        {
          as: "menu",
          model: this.ctx.app.model.Menu,
        },
      ],
    });
  }

  /**
   * 创建
   */
  createRoleMenu(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.RoleMenu.create({
      ...input,
      createBy: id,
      updateBy: id,
    });
  }

  /**
   * 更新
   */
  updateRoleMenu(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.RoleMenu.update(
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
   * 删除
   */
  deleteRoleMenu(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.roleMenu.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = RoleMenuConnector;
