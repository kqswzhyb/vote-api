exports.login = async (ctx) => {
  const body = await ctx.service.auth.login(ctx.request.body)
  ctx.body = body
};

exports.register = async (ctx) => {
  const createRule = {
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  };
  // 校验参数
  ctx.validate(createRule);

  const user = await ctx.model.User.create(ctx.request.body);
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      user: {
        username: user.username,
      },
    },
  };
};
