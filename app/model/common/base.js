const uuid = require('uuid');
const { UUID, STRING, DATE } = require('Sequelize');

module.exports = {
  id: {
    type: UUID,
    unique: true,
    primaryKey: true,
    allowNull: false,
    defaultValue: () => uuid.v4().replace(/-/g, ''),
  },
  status: {
    type: STRING(1),
    allowNull: false,
    comment: '状态',
    defaultValue: '0',
  },
  createBy: {
    type: UUID,
    allowNull: true,
    comment: '创建者',
  },
  updateBy: {
    type: UUID,
    allowNull: true,
    comment: '更新者',
  },
  createdAt: DATE,
  updatedAt: DATE,
  remark: {
    type: STRING(200),
    allowNull: true,
    comment: '备注',
  },
};
