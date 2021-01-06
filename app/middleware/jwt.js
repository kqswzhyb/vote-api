const errorMap = require("../graphql/utils/errorMap");
module.exports = (options) => {
  return async function jwt(ctx, next) {
    const token = ctx.request.header.authorization;
    let decode;
    if (token) {
      try {
        // 解码token
        const tokenc = (token + "").slice(7);
        decode = ctx.app.jwt.verify(tokenc, options.secret);
        let redisToken = await ctx.service.redis.get(decode.id);
        if (tokenc !== redisToken) {
          ctx.status = 401;
          ctx.body = {
            code: "2",
            message: errorMap["2"],
          };
        }
        await next();
      } catch (error) {
        ctx.status = 401;
        ctx.body = {
          code: "1",
          message: error.message,
        };
        return;
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        code: "1",
        message: errorMap["1"],
      };
      return;
    }
  };
};
