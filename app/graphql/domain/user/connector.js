"use strict";

const moment = require("moment");
const UUID = require("uuid");
const { handleFilter, getOperator } = require("../../utils/util.js");
const errorMap = require("../../utils/errorMap");

class UserConnector {
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * 查询所有
   * @returns {*}
   */
  fetchList(data) {
    const { page = {}, filter = {} } = data;
    return this.ctx.app.model.User.findAll({
      where: {
        status: "0",
        ...handleFilter(filter),
      },
      include: [
        {
          as: "userInvitateCode",
          model: this.ctx.app.model.UserInvitateCode,
        },
        {
          as: "file",
          model: this.ctx.app.model.File,
        },
        {
          as: "role",
          model: this.ctx.app.model.Role,
          include: [
            {
              as: "roleMenu",
              model: this.ctx.app.model.RoleMenu,
              include: [
                {
                  as: "menu",
                  model: this.ctx.app.model.Menu,
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
  }

  /**
   * 查询总数
   * @returns {*}
   */
  async fetchCount(data) {
    const { filter = {} } = data;
    const count = await this.ctx.app.model.User.count({
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
   * 查询单个
   * @param id
   * @returns {Promise<V> | Promise.<V>}
   */
  async fetchById(id) {
    return this.ctx.app.model.User.findOne({
      where: {
        status: "0",
        id,
      },
      include: [
        {
          as: "userInvitateCode",
          model: this.ctx.app.model.UserInvitateCode,
        },
        {
          as: "file",
          model: this.ctx.app.model.File,
        },
        {
          as: "role",
          model: this.ctx.app.model.Role,
          include: [
            {
              as: "roleMenu",
              model: this.ctx.app.model.RoleMenu,
              include: [
                {
                  as: "menu",
                  model: this.ctx.app.model.Menu,
                },
              ],
            },
          ],
        },
      ],
    });
  }

  /**
   * 创建用户
   */
  async createUser(data, ctx) {
    const id = getOperator(ctx);
    const { input = {} } = data;
    const recordId = UUID.v4().replace(/-/g, "");
    let transaction;
    try {
      transaction = await ctx.model.transaction();
      if (input.fileList) {
        input.fileList.forEach(async (v) => {
          await this.ctx.app.model.File.create(
            {
              recordId,
              fileName: v.fileName,
              filePath: v.filePath,
              fileExt: v.fileExt,
              fileFullPath: v.filePath + "/" + v.fileName + "." + v.fileExt,
              createBy: id,
            },
            {
              transaction,
            }
          );
        });
        delete input.fileList;
      }

      await this.ctx.app.model.User.create(
        {
          id: recordId,
          ...input,
          qqOpenId: "123456",
          qqLevel: "1",
          qqVip: "1",
          createBy: id,
          roleId: "1",
          lastLoginTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          transaction,
        }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
    return this.fetchById(recordId);
  }

  /**
   * 更新用户
   */
  async updateUser(data, ctx) {
    const userId = getOperator(ctx);
    const { input = {}, id } = data;
    let transaction;
    let res;
    try {
      transaction = await ctx.model.transaction();
      if (input.fileList) {
        if (!input.fileList.length) {
          await this.ctx.app.model.File.destroy({
            where: {
              recordId: id,
            },
            transaction,
          });
        } else {
          if (!input.fileList[0].recordId) {
            let v = input.fileList[0];
            await this.ctx.app.model.File.destroy({
              where: {
                recordId: id,
              },
              transaction,
            });
            await this.ctx.app.model.File.create(
              {
                recordId: id,
                fileName: v.fileName,
                filePath: v.filePath,
                fileExt: v.fileExt,
                fileFullPath: v.filePath + "/" + v.fileName + "." + v.fileExt,
                createBy: userId,
              },
              {
                transaction,
              }
            );
          }
        }
        delete input.fileList;
      }

      res = await this.ctx.app.model.User.update(
        Object.assign({}, input, { updateBy: userId }),
        {
          where: { id },
          transaction,
        }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
    return res[0] == 1 ? this.fetchById(id) : null;
  }

  /**
   * 删除用户
   */
  deleteUser(data) {
    const { id } = data;
    return new Promise((resolve) => {
      this.ctx.app.model.User.destroy({ where: { id } }).then((res) => {
        resolve(
          res == 1
            ? { code: "0", message: "成功" }
            : { code: "1001", message: errorMap["1001"] }
        );
      });
    });
  }
}

module.exports = UserConnector;
