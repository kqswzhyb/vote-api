'use strict';

const DataLoader = require('dataloader');
const moment = require('moment');
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
        as: 'userInvitateCode',
        model: this.ctx.app.model.UserInvitateCode,
      }],
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

  /**
   * 创建用户
   */
  createUser(data) {
    const { input = {} } = data;
    return this.ctx.app.model.User.create({...input,lastLoginTime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')})
  }

  /**
   * 更新用户
   */
  updateUser(data) {
    const { input = {},id } = data;
    return new Promise((resolve)=>{
      this.ctx.app.model.User.update(input, { where: { id }}).then((res)=>{
        resolve(res[0]==1?this.loader.load(id):null)
      })
    })
  }

  /**
   * 删除用户
   */
  deleteUser(data) {
    const { id } = data;
    return new Promise((resolve)=>{
      this.ctx.app.model.User.destroy({ where: { id } }).then((res)=>{
        resolve(res==1?{code:0,message:'成功'}:{code:1001,message:'id不存在'});
      })
    })
  }
}

module.exports = UserConnector;
