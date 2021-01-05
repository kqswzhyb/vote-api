'use strict';

const DataLoader = require('dataloader');
const { handleFilter } = require('../../utils/util.js');

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
        status: '0',
        ...handleFilter(filter),
      },
      order: [
        ['updatedAt', 'DESC'],
      ],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return roles;
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 创建
   */
  createRole(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.Role.create({
      ...input,
      createBy: id,
    });
  }

  /**
   * 更新
   */
  updateRole(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.Role.update(Object.assign({}, input, { updateBy: userId }), {
        where: { id },
      }).then((res) => {
        resolve(res[0] == 1 ? this.fetchById(id) : null);
      });
    });
  }
}

module.exports = RoleConnector;
