const { Op } = require('Sequelize');

exports.handleFilter = (filter) => {
  Object.keys(filter).forEach((v) => {
    filter[v] = JSON.parse(filter[v]);
    if (filter[v].cond === 'and') {
      filter[v] = filter[v].value;
    } else {
      filter[v] = {
        [Op[filter[v].cond]]: filter[v].cond.includes('ike') ? `%${filter[v].value}%` : filter[v].value,
      };
    }
  });
  return filter;
};
