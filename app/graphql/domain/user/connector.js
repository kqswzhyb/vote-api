'use strict';

const DataLoader = require('dataloader');
const { handleFilter } = require('../../utils/util.js');

class UserConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  /**
     * DataLoader缓存数据
     * @param ids
     * @returns {Promise.<*[]>}
     */
  fetch(ids) {
    const users = this.ctx.app.model.User.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      users.then((res) => {
        res.length ? resolve(res) : resolve([{}]);
      });
    });
  }

  /**
     * 查询多个用户信息
     * @param ids
     * @returns {Promise.<Array.<V|Error>>|Promise<Array<Error | V>>}
     */
  fetchByIds(ids) {
    return this.loader.loadMany(ids);
  }

  /**
     * 查询所有
     * @returns {*}
     */
  fetchList(data) {
    const { page = {}, filter = {} } = data;
    const users = this.ctx.app.model.User.findAll({
      where: {
        status: '0',
        ...handleFilter(filter),
      },
      include: [{
        attributes: [ 'id', 'useCount', 'userId' ],
        model: this.ctx.app.model.UserInvitateCode,
      }],
      order: [
        ['updatedAt', 'DESC'],
      ],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    console.log(users)
    return users;
  }

  /**
     * 查询单个
     * @param id
     * @returns {Promise<V> | Promise.<V>}
     */
  fetchById(id) {
    return this.loader.load(id);
  }
}

module.exports = UserConnector;
