'use strict';

const DataLoader = require('dataloader');
const { handleFilter } = require('../../utils/util.js');

class UserInvitateCodeConnector {
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
    const userInvitateCodes = this.ctx.app.model.UserInvitateCode.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      userInvitateCodes.then((res) => {
        res.length ? resolve(res) : resolve([{}]);
      });
    });
  }

  /**
     * 查询多个用户邀请码
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
    const users = this.ctx.app.model.UserInvitateCode.findAll({
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

module.exports = UserInvitateCodeConnector;
