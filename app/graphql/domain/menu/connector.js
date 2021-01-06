'use strict';

const DataLoader = require('dataloader');
const { handleFilter } = require('../../utils/util.js');
const errorMap = require('../../utils/errorMap')

class MenuConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const menu = this.ctx.app.model.Menu.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      menu.then((res) => {
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
    const menus = this.ctx.app.model.Menu.findAll({
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
    return menus;
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 创建
   */
  createMenu(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.Menu.create({
      ...input,
      createBy: id,
    });
  }

  /**
   * 更新
   */
  updateMenu(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.Menu.update(Object.assign({}, input, { updateBy: userId }), {
        where: { id },
      }).then((res) => {
        resolve(res[0] == 1 ? this.fetchById(id) : null);
      });
    });
  }

  /**
   * 删除
   */
  deleteMenu(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.Menu.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = MenuConnector;
