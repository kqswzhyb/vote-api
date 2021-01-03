exports.info = async (ctx) => {
  const body = await ctx.service.user.info()
  ctx.body = body
};
