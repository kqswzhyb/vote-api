const { Op } = require("Sequelize");

exports.handleFilter = (filter) => {
  Object.keys(filter).forEach((v) => {
    filter[v] = JSON.parse(filter[v]);
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
  const token = ctx.request.header["authorization"].slice(7);
  let id
  try {
    const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    id = decode.id;
  } catch (err) {
    throw new Error(err)
  }
  return id
};
