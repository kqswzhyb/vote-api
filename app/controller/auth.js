exports.login = async (ctx) => {
  const body = await ctx.service.auth.login(ctx.request.body)
  ctx.body = body
};

exports.logout = async (ctx) => {
  const body = await ctx.service.auth.logout(ctx.request.body)
  ctx.body = body
};
