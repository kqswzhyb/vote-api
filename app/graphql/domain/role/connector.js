"use strict";

const DataLoader = require("dataloader");
const { handleFilter } = require("../../utils/util.js");

class RoleConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const role = this.ctx.app.model.Role.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      role.then((res) => {
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
    const roles = this.ctx.app.model.Role.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
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
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return roles;
  }

  fetchById(id) {
    return this.ctx.app.model.Role.findOne({
      where: {
        status: "0",
        id,
      },
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
    });
  }

  /**
   * 创建
   */
  createRole(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    const role = this.ctx.app.model.Role.create({
      ...input,
      createBy: id,
    });
    role.then(res=>{
        this.ctx.app.model.RoleMenu.create({
            roleId: res.dataValues.id,
            menuId: '1',
            createBy: id,
        });
    })
    return role
  }

  /**
   * 更新
   */
  updateRole(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.Role.update(
        Object.assign({}, input, { updateBy: userId }),
        {
          where: { id },
        }
      ).then((res) => {
        resolve(res[0] == 1 ? this.fetchById(id) : null);
      });
    });
  }
}

module.exports = RoleConnector;
