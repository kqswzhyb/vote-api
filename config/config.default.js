'use strict';

module.exports = () => {
  const config = {
    sequelize: {
      dialect: 'mysql',
      database: 'vote',
      host: 'localhost',
      port: '3306',
      username: 'root',
      password: 'root',
      timezone: '+8:00'
    },
    proxyworker: {
      port: 10086,
    },
    middleware: ['graphqlJwt','graphql'],
    security: {
      csrf: {
        throughPath:['/api/auth/login'],
        headerName:'authorization',
        ignore: () => true,
      },
    },
    redis: {
      client: {
        port: '6379',
        host: 'localhost',
        password: '',
        db: 0
      },
    },
    jwt: {
      secret: "123456"//自定义 token 的加密条件字符串
    },
    graphql: {
      router: '/api/graphql',
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
      // 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
      graphiql: true,
      // graphQL 路由前的拦截器
      onPreGraphQL: function* (ctx) {},
      // 开发工具 graphiQL 路由前的拦截器，建议用于做权限操作(如只提供开发者使用)
      onPreGraphiQL: function* (ctx) {},
    },
    cors: {
      origin:'*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    },
  };

  // should change to your own
  config.keys = 'egg-graphql';

  return config;
};
