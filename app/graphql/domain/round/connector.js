"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class RoundConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const round = this.ctx.app.model.Round.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          as: "role",
          model: this.ctx.app.model.RoundRole,
        },
      ],
    });
    return new Promise((resolve, reject) => {
      round.then((res) => {
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
    const rounds = this.ctx.app.model.Round.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      include: [
        {
          as: "role",
          model: this.ctx.app.model.RoundRole,
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return rounds;
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 创建
   */
  createRound(data, ctx) {
    const id = getOperator(ctx);
    const { input = {}, transaction = null } = data;
    return this.ctx.app.model.Round.create(
      {
        ...input,
        createBy: id,
        updateBy: id,
      },
      { transaction }
    );
  }

  /**
   * 更新
   */
  updateRound(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.Round.update(
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
  deleteRound(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.Round.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = RoundConnector;
