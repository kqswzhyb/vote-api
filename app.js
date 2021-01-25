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
    app.model.DicType.hasMany(app.model.Dic, {
      as: "dic",
      foreignKey: "typeId",
      sourceKey: "id",
      scope: {
        status: "0",
      },
    });
    app.model.Vote.hasMany(app.model.VoteRoleType, {
      as: "voteRoleType",
      foreignKey: "voteId",
      sourceKey: "id",
      scope: {
        status: "0",
      },
    });
    app.model.Vote.hasOne(app.model.VoteConfig, {
      as: "voteConfig",
      foreignKey: "voteId",
      sourceKey: "id",
      scope: {
        status: "0",
      },
    });
    app.model.VoteConfig.hasOne(app.model.File, {
      as: "file",
      foreignKey: "recordId",
      sourceKey: "id",
      scope: {
        status: "0",
      },
    });
    app.model.VoteRole.hasOne(app.model.File, {
      as: "file",
      foreignKey: "recordId",
      sourceKey: "id",
      scope: {
        status: "0",
      },
    });
    app.model.Vote.hasMany(app.model.VoteRole, {
      as: "voteRole",
      foreignKey: "voteId",
      sourceKey: "id",
      scope: {
        status: "0",
      },
    });
    app.model.Vote.hasMany(app.model.RoundStage, {
      as: "roundStage",
      foreignKey: "voteId",
      sourceKey: "id",
    });
    app.model.RoundStage.hasMany(app.model.Round, {
      as: "round",
      foreignKey: "roundStageId",
      sourceKey: "id",
    });
    app.model.Round.hasMany(app.model.RoundRole, {
      as: "roundRole",
      foreignKey: "roundId",
      sourceKey: "id",
    });
    app.model.RoundRole.hasOne(app.model.VoteRole, {
      as: "voteRole",
      foreignKey: "id",
      sourceKey: "roleId",
      scope: {
        status: "0",
      },
    });
    app.model.VoteRecord.hasOne(app.model.RoundRole, {
      as: "roundRole",
      foreignKey: "id",
      sourceKey: "roundRoleId",
      scope: {
        status: "0",
      },
    });
    app.model.UserFollow.hasOne(app.model.User, {
      as: "user",
      foreignKey: "id",
      sourceKey: "followId",
      scope: {
        status: "0",
      },
    });
    app.model.UserFollow.hasOne(app.model.Vote, {
      as: "vote",
      foreignKey: "id",
      sourceKey: "followId",
    });
    app.model.VoteDiscuss.hasOne(app.model.User, {
      as: "user",
      foreignKey: "id",
      sourceKey: "userId",
    });
    app.model.VoteDiscuss.hasMany(app.model.VoteDiscuss, {
      as: "voteDiscuss",
      foreignKey: "replyId",
      sourceKey: "id",
    });
    app.model.VoteRecord.hasOne(app.model.Vote, {
      as: "vote",
      foreignKey: "id",
      sourceKey: "voteId",
    });
    app.model.VoteRecord.hasOne(app.model.Round, {
      as: "round",
      foreignKey: "id",
      sourceKey: "roundId",
    });
  });
};
