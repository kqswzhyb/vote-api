"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class RoundStageConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const roundStage = this.ctx.app.model.RoundStage.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          as: "round",
          model: this.ctx.app.model.Round,
          include: [
            {
              as: "roundRole",
              model: this.ctx.app.model.RoundRole,
            },
          ],
        },
      ],
    });
    return new Promise((resolve, reject) => {
      roundStage.then((res) => {
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
    const roundStages = this.ctx.app.model.RoundStage.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      include: [
        {
          as: "round",
          model: this.ctx.app.model.Round,
          include: [
            {
              as: "roundRole",
              model: this.ctx.app.model.RoundRole,
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return roundStages;
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 创建
   */
  createRoundStage(data, ctx) {
    const id = getOperator(ctx);
    const { input = {}, transaction = null } = data;
    return this.ctx.app.model.RoundStage.create(
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
  async batchCreateRoundStage(data, ctx) {
    const { arr = [], transaction = null } = data;
    const res = await this.ctx.app.model.RoundStage.bulkCreate(arr, {
      transaction,
    });
    return res;
  }

  /**
   * 更新
   */
  updateRoundStage(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.RoundStage.update(
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
  deleteRoundStage(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.RoundStage.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = RoundStageConnector;
