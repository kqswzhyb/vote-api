'use strict';

module.exports = (app) => {
  app.post('/api/auth/login', 'auth.login');
};
