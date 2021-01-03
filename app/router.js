'use strict';

module.exports = (app) => {
  const jwt = app.middleware.jwt(app.config.jwt);
  app.post('/api/auth/login', 'auth.login');
  app.get('/api/auth/logout',jwt, 'auth.logout');

  app.get('/api/user/info',jwt, 'user.info');
};
