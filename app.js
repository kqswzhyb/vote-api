module.exports = (app) => {
  app.beforeStart(async () => {
    await app.model.sync();
    app.model.RoleMenu.hasOne(app.model.Menu, {
      as: "menu",
      foreignKey: "id",
      sourceKey: "menuId",
      scope: {
        status: "0",
      },
    });
    app.model.Role.hasMany(app.model.RoleMenu, {
      as: "roleMenu",
      foreignKey: "roleId",
      sourceKey: "id",
      scope: {
        status: "0",
      },
    });
    app.model.User.hasMany(app.model.UserInvitateCode, {
      as: "userInvitateCode",
      foreignKey: "userId",
      sourceKey: "id",
      scope: {
        status: "0",
      },
    });
    app.model.User.hasOne(app.model.Role, {
      as: "role",
      foreignKey: "id",
      sourceKey: "roleId",
      scope: {
        status: "0",
      },
    });
    app.model.User.hasOne(app.model.File, {
      as: "file",
      foreignKey: "recordId",
      sourceKey: "id",
      scope: {
        status: "0",
      },
    });
  });
};
