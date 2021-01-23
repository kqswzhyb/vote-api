"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");

class UserFollowConnector {
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
    const userFollow = this.ctx.app.model.UserFollow.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          as: "user",
          model: this.ctx.app.model.User,
          include: [
            {
              as: "file",
              model: this.ctx.app.model.File,
            },
          ],
        },
        {
          as: "vote",
          model: this.ctx.app.model.Vote,
          include: [
            {
              as: "voteConfig",
              model: this.ctx.app.model.VoteConfig,
              include: [
                {
                  as: "file",
                  model: this.ctx.app.model.File,
                },
              ],
            },
          ],
        },
      ],
    });
    return new Promise((resolve, reject) => {
      userFollow.then((res) => {
        const dataJson = res.map((v) => v.toJSON());
        dataJson.forEach((v) => {
          if (v.followType === "0") {
            v.follow = v.vote;
          }
          if (v.followType === "1") {
            v.follow = v.user;
          }
          delete v.vote;
          delete v.user;
        });
        res.length ? resolve(dataJson) : resolve([{}]);
      });
    });
  }

  /**
   * 查询所有
   * @returns {*}
   */
  async fetchList(data) {
    const { page = {}, filter = {} } = data;
    const userFollows = await this.ctx.app.model.UserFollow.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      include: [
        {
          as: "user",
          model: this.ctx.app.model.User,
          include: [
            {
              as: "file",
              model: this.ctx.app.model.File,
            },
          ],
        },
        {
          as: "vote",
          model: this.ctx.app.model.Vote,
          include: [
            {
              as: "voteConfig",
              model: this.ctx.app.model.VoteConfig,
              include: [
                {
                  as: "file",
                  model: this.ctx.app.model.File,
                },
              ],
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    const dataJson = userFollows.map((v) => v.toJSON());
    dataJson.forEach((v) => {
      if (v.followType === "0") {
        v.follow = v.vote;
      }
      if (v.followType === "1") {
        v.follow = v.user;
      }
      delete v.vote;
      delete v.user;
    });
    return dataJson;
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
    const count = await this.ctx.app.model.UserFollow.count({
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
  createUserFollow(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.UserFollow.create({
      ...input,
      createBy: id,
      updateBy: id,
    });
  }

  /**
   * 更新
   */
  updateUserFollow(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.UserFollow.update(
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
  deleteUserFollow(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.UserFollow.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = UserFollowConnector;
