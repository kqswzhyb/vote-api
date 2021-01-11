const { Op } = require("Sequelize");

exports.handleFilter = (filter) => {
  Object.keys(filter).forEach((v) => {
    filter[v] = JSON.parse(filter[v]);
    if (filter[v].value === "") {
      delete filter[v];
      return
    };
    if (filter[v].cond === "rangeTime") {
      if (filter[v].value.length === 2) {
        filter[v] = {
          [Op.gte]: filter[v].value[0],
          [Op.lte]: filter[v].value[1],
        };
      } else {
        delete filter[v];
      }
      return;
    }
    if (filter[v].cond === "and") {
      filter[v] = filter[v].value;
    } else {
      filter[v] = {
        [Op[filter[v].cond]]: filter[v].cond.includes("ike")
          ? `%${filter[v].value}%`
          : filter[v].value,
      };
    }
  });
  return filter;
};

exports.getOperator = (ctx) => {
  if (!ctx.request.header["authorization"]) {
    throw new Error("没有token");
  }
  const token = ctx.request.header["authorization"].slice(7);
  let id;
  try {
    const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    id = decode.id;
  } catch (err) {
    throw new Error(err);
  }
  return id;
};
