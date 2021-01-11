"use strict";

const DataLoader = require("dataloader");
const { handleFilter,getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class VoteRoleTypeConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const voteRoleType = this.ctx.app.model.VoteRoleType.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      voteRoleType.then((res) => {
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
    const voteRoleTypes = this.ctx.app.model.VoteRoleType.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return voteRoleTypes;
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 创建
   */
  createVoteRoleType(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.VoteRoleType.create({
      ...input,
      createBy: id,
      updateBy: id,
    });
  }

  /**
   * 更新
   */
  updateVoteRoleType(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteRoleType.update(
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
  deleteVoteRoleType(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteRoleType.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = VoteRoleTypeConnector;
