'use strict';

module.exports = () => {
  const config = {
    swaggerdoc: {
      dirScanner: './app/controller', // 配置自动扫描的控制器路径。
      // 接口文档的标题，描述或其它。
      apiInfo: {
          title: '投票系统接口',  // 接口文档的标题。
          description: 'restful接口',   // 接口文档描述。
          version: '1.0.0',   // 接口文档版本。
      },
      schemes: ['http', 'https'], // 配置支持的协议。
      consumes: ['application/json'], // 指定处理请求的提交内容类型（Content-Type），例如application/json, text/html。
      produces: ['application/json'], // 指定返回的内容类型，仅当request请求头中的(Accept)类型中包含该指定类型才返回。
      securityDefinitions: {  // 配置接口安全授权方式。
          apikey: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
          // oauth2: {
          //   type: 'oauth2',
          //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
          //   flow: 'password',
          //   scopes: {
          //     'write:access_token': 'write access_token',
          //     'read:access_token': 'read access_token',
          //   },
          // },
      },
      enableSecurity: true,  // 是否启用授权，默认 false（不启用）。
      // enableValidate: true,    // 是否启用参数校验，默认 true（启用）。
      routerMap: true,    // 是否启用自动生成路由，默认 true (启用)。
      enable: true,   // 默认 true (启用)。
    },
    sequelize: {
      dialect: 'mysql',
      database: 'vote',
      host: 'localhost',
      port: '3306',
      username: 'root',
      password: 'root',
      dialectOptions: {
        dateStrings: true,
        typeCast: true
      },
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
