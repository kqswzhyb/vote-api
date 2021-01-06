const Service = require("egg").Service;
const UUID = require("uuid");
const fs = require("fs");
const path = require("path");
const setting = require("../setting");
const COS = require("cos-nodejs-sdk-v5");
const cos = new COS({
  SecretId: setting["SecretId"],
  SecretKey: setting["SecretKey"],
});

class FileService extends Service {
  // 单文件上传
  async simpleUpload(stream) {
    const filePath = path.join(
      this.config.baseDir,
      `app/public/${stream.filename}`
    );
    let id = UUID.v4().slice(0, 5) + "-" + (new Date().getTime() + "");
    const writerStream = fs.createWriteStream(filePath);
    stream.pipe(writerStream);
    const fileMsg = stream.filename.split(".");
    const filename = fileMsg[0] + "-" + id;
    const fileExt = fileMsg[1];
    const fileDic = stream.fields.fileDic || "img";

    return new Promise((resolve) => {
      cos.putObject(
        {
          Bucket: setting["Bucket"],
          Region: setting["Region"],
          Key: fileDic + "/" + filename + "." + fileExt,
          StorageClass: "STANDARD",
          Body: fs.createReadStream(filePath),
        },
        async (err, data) => {
          if (err) {
            resolve({
              code: "2001",
              message: err,
            });
          }
          resolve({
            code: "0",
            message: "成功",
            data: {
              filename,
              fileExt,
              filePath: fileDic,
              fileFullPath: fileDic + "/" + filename + "." + fileExt,
            },
          });
        }
      );
    });
  }
}
module.exports = FileService;
