const base = require('./common/base.js');

module.exports = (app) => {
  const { STRING, DATE,UUID,INTEGER } = app.Sequelize;

  const UserInvitateCode = app.model.define('user_invitate_code', {
    roundDetailId: {
      type: UUID,
      allowNull: false,
      comment: '比赛详情场次Id',
    },
    invitateCode: {
      type: UUID,
      allowNull: false,
      comment: '邀请码',
    },
    expireTime: {
      type: DATE,
      comment: '过期时间',
    },
    useCount: {
      type: INTEGER,
      comment: '使用次数',
    },
    userId: {
      type: UUID,
      allowNull: false,
      comment: '用户id',
    },
    ...base,
  }, {
    tableName: 'user_invitate_code'
});

//   UserInvitateCode.associate = () => {
//     app.model.UserInvitateCode.hasOne(app.model.User,{as: 'userInvitateCode', foreignKey: 'userId' })
//   };

  return UserInvitateCode;
};
