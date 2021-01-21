'use strict';

// had enabled by egg
// exports.static = true;

exports.swaggerdoc = {
  enable: true,   // 是否启用。
  package: 'egg-swagger-doc', // 指定包名称。
};

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.graphql = {
  enable: true,
  package: 'egg-graphql',
};

exports.proxyworker = {
  enable: true,
  package: 'egg-development-proxyworker',
};

exports.validate = {
  package: 'egg-validate',
};

exports.redis = {
  enable: true,
  package: 'egg-redis'
}

exports.jwt= {
  enable: true,
  package: "egg-jwt"
}

exports.cors= {
  enable: true,
  package: 'egg-cors',
}

exports.io = {
  enable: true,
  package: 'egg-socket.io',
};