'use strict';

// had enabled by egg
// exports.static = true;

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