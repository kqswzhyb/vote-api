"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class RoundRoleConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const roundRole = this.ctx.app.model.RoundRole.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          as: "voteRole",
          model: this.ctx.app.model.VoteRole,
          include: [
            {
              as: "file",
              model: this.ctx.app.model.File,
            },
          ],
        },
      ],
    });
    return new Promise((resolve, reject) => {
      roundRole.then((res) => {
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
    const roundRoles = this.ctx.app.model.RoundRole.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      include: [
        {
          as: "voteRole",
          model: this.ctx.app.model.VoteRole,
          include: [
            {
              as: "file",
              model: this.ctx.app.model.File,
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return roundRoles;
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 创建
   */
  createRoundRole(data, ctx) {
    const id = getOperator(ctx);
    const { input = {}, transaction = null } = data;
    return this.ctx.app.model.RoundRole.create(
      {
        ...input,
        createBy: id,
        updateBy: id,
      },
      { transaction }
    );
  }

  /**
   * 批量创建
   */
  batchCreateRole(data, ctx) {
    const { arr = [], transaction = null } = data;
    return this.ctx.app.model.RoundRole.bulkCreate(arr, { transaction });
  }

  /**
   * 更新
   */
  updateRoundRole(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id ,transaction=null} = data;
    return new Promise((resolve) => {
      this.ctx.app.model.RoundRole.update(
        Object.assign({}, input, { updateBy: userId }),
        {
          where: { id },
          transaction
        }
      ).then((res) => {
        resolve(res);
      });
    });
  }

  /**
   * 删除
   */
  deleteRoundRole(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.RoundRole.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = RoundRoleConnector;
