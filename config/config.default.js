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
    middleware: ['graphql'],
    security: {
      csrf: {
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
    cors: {
      origin:'*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    },
  };

  // should change to your own
  config.keys = 'egg-graphql';

  return config;
};
