module.exports = options => {
  return async function jwt(ctx, next) {
    const token = ctx.request.header.authorization;
    let decode;
    if (token) {
      try {
        // 解码token
        const tokenc = (token+'').slice(7);
        decode = ctx.app.jwt.verify(tokenc, options.secret);
        let redisToken = await ctx.service.redis.get(decode.id);
        if(tokenc!==redisToken){
          throw new Error('token已过期')
        }
        await next();
      } catch (error) {
        ctx.status = 401;
        ctx.body = {
          message: error.message,
        };
        return;
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        message: '没有token',
      };
      return;
    }
  };
};
