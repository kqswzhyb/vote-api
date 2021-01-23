const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, DATE, UUID, INTEGER } = app.Sequelize;

  return app.model.define(
    "vote_discuss",
    {
      voteId: {
        type: UUID,
        allowNull: false,
        comment: "比赛Id",
      },
      userId: {
        type: UUID,
        allowNull: false,
        comment: "用户Id",
      },
      replyId: {
        type: UUID,
        comment: "评论Id",
      },
      content: {
        type: STRING(500),
        allowNull: false,
        comment: "评论内容",
      },
      likeCount: {
        type: INTEGER,
        allowNull: false,
        comment: "赞数",
        defaultValue: 0,
      },
      dislikeCount: {
        type: INTEGER,
        allowNull: false,
        comment: "踩数",
        defaultValue: 0,
      },
      ...base,
    },
    {
      tableName: "vote_discuss",
    }
  );
};
