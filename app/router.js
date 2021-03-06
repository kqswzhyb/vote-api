"use strict";

module.exports = (app) => {
  const { io } = app;
  const jwt = app.middleware.jwt(app.config.jwt);
  app.post("/api/auth/login", "auth.login");
  app.get("/api/auth/logout", jwt, "auth.logout");

  app.get("/api/user/info", jwt, "user.info");

  app.post("/api/file/simpleUpload", jwt, "file.simpleUpload");

  io.of("/").route("message", io.controller.message.message);
};
