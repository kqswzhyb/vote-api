"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");

class UserMessageConnector {
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
    const userMessage = this.ctx.app.model.UserMessage.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      userMessage.then((res) => {
        res.length ? resolve(res) : resolve([{}]);
      });
    });
  }

  /**
   * 查询所有
   * @returns {*}
   */
  async fetchList(data) {
    const { page = {}, filter = {} } = data;
    const userMessages = await this.ctx.app.model.UserMessage.findAll({
      where: {
        ...handleFilter(filter),
      },
      order: [["createdAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return userMessages;
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
   * 查询总数
   * @returns {*}
   */
  async fetchCount(data) {
    const { filter = {} } = data;
    const count = await this.ctx.app.model.UserMessage.count({
      where: {
        ...handleFilter(filter),
      },
    });
    return {
      total: count,
    };
  }

  /**
   * 创建
   */
  createUserMessage(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.UserMessage.create({
      ...input,
      createBy: id,
      updateBy: id,
    });
  }

  /**
   * 批量创建
   */
  batchCreateUserMessage(data, ctx) {
    const { arr = [], transaction = null } = data;
    return this.ctx.app.model.UserMessage.bulkCreate(arr, { transaction });
  }

  /**
   * 更新
   */
  updateUserMessage(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.UserMessage.update(
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
  deleteUserMessage(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.UserMessage.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = UserMessageConnector;
