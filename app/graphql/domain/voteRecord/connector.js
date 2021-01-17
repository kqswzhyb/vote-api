"use strict";

const DataLoader = require("dataloader");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class VoteRecordConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const voteRecord = this.ctx.app.model.VoteRecord.findAll({
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
      voteRecord.then((res) => {
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
    return this.ctx.app.model.VoteRecord.findAll({
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
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  /**
   * 查询总数
   * @returns {*}
   */
  async fetchCount(data) {
    const { filter = {} } = data;
    const count = await this.ctx.app.model.VoteRecord.count({
      where: {
        status: "0",
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
  async createVoteRecord(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    return this.ctx.app.model.VoteRecord.create(
      {
        ...input,
        createBy: id,
        updateBy: id,
      }
    );
  }

  /**
   * 更新
   */
  async updateVoteRecord(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteRecord.update(
        Object.assign({}, input, { updateBy: userId }),
        {
          where: { id }
        }
      ).then((res) => {
        resolve(res[0] == 1 ? this.fetchById(id) : null);
      });
    });
  }

  /**
   * 删除
   */
  deleteVoteRecord(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.VoteRecord.destroy({ where: { id } }).then(
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

module.exports = VoteRecordConnector;
