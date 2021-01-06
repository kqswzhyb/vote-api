"use strict";

const Controller = require("egg").Controller;

/**
 * @controller File
 */
class FileController extends Controller {
  /** 
   * @summary 单文件上传
   * @description 单文件上传
   * @router POST /api/file/simpleUpload
   * @Request formData file *file
   * @Request formData string fileDic
   * @Request header string authorization
   * @response 200 loginBody
   */
  async simpleUpload(ctx) {
    const stream = await ctx.getFileStream();
    const body = await ctx.service.file.simpleUpload(stream);
    ctx.body = body;
  }
}
module.exports = FileController;
