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
      field: 'user_id',
      references: {
        model: 'user',
        key: 'id',
      },
      comment: '用户id',
    },
    ...base,
  });

  UserInvitateCode.associate = () => {
    app.model.UserInvitateCode.belongsTo(app.model.User,{foreignKey: 'user_id', targetKey: 'id' })
  };

  return UserInvitateCode;
};
