"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class DataAnalysisConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const dataAnalysis = this.ctx.app.model.DataAnalysis.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      dataAnalysis.then((res) => {
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
    const dataAnalysiss = this.ctx.app.model.DataAnalysis.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return dataAnalysiss;
  }

  /**
   * 查询总数
   * @returns {*}
   */
  async fetchCount(data) {
    const { filter = {} } = data;
    const count = await this.ctx.app.model.DataAnalysis.count({
      where: {
        ...handleFilter(filter),
      },
    });
    return {
      total: count,
    };
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 创建
   */
  createDataAnalysis(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.DataAnalysis.create({
      ...input,
      createBy: id,
      updateBy: id,
    });
  }

  /**
   * 更新
   */
  updateDataAnalysis(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.DataAnalysis.update(
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
  deleteDataAnalysis(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.DataAnalysis.destroy({ where: { id } }).then(
        async (res) => {
          resolve(
            res == 1
              ? { code: "0", message: "成功" }
              : { code: "1001", message: errorMap["1001"] }
          );
        }
      );
    });
  }
}

module.exports = DataAnalysisConnector;
