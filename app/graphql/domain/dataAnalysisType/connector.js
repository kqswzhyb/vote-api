"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class DataAnalysisTypeConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const dataAnalysisType = this.ctx.app.model.DataAnalysisType.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      dataAnalysisType.then((res) => {
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
    const dataAnalysisTypes = this.ctx.app.model.DataAnalysisType.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      order: [["updatedAt", "DESC"]],
      limit: page.limit || 10,
      offset: page.offset || 0,
    });
    return dataAnalysisTypes;
  }

  /**
   * 查询总数
   * @returns {*}
   */
  async fetchCount(data) {
    const { filter = {} } = data;
    const count = await this.ctx.app.model.DataAnalysisType.count({
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
  createDataAnalysisType(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.DataAnalysisType.create({
      ...input,
      createBy: id,
      updateBy: id,
    });
  }

  /**
   * 更新
   */
  updateDataAnalysisType(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.DataAnalysisType.update(
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
  deleteDataAnalysisType(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.DataAnalysisType.destroy({ where: { id } }).then(
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

module.exports = DataAnalysisTypeConnector;
