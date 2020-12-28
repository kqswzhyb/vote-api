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
  };

  // should change to your own
  config.keys = 'egg-graphql';

  return config;
};
