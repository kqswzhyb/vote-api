'use strict';

const DataLoader = require('dataloader');

class FileConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    const file = this.ctx.app.model.File.findAll({
      where: {
        id: ids,
      },
    });
    return new Promise((resolve, reject) => {
      file.then((res) => {
        res.length ? resolve(res) : resolve([{}]);
      });
    });
  }
  
  fetchById(id) {
    return this.loader.load(id);
  }
}

module.exports = FileConnector;
