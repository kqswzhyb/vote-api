'use strict';

module.exports = (app) => {
  const jwt = app.middleware.jwt(app.config.jwt);
  app.get('/',jwt, 'home.index');
  app.post('/api/auth/login', 'auth.login');
  app.post('/api/auth/register', 'auth.register');
  app.resources('users', '/api/users', app.controller.user);
  app.resources('userInvitateCodes', '/api/userInvitateCodes', app.controller.userInvitateCode);
};
