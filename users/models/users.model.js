const { DataTypes } = require('sequelize');
const { postgresConnection } = require('../../database')

const User = postgresConnection.define('user', {
  // Model attributes are defined here
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  favorite_cards: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  role: {
    type: DataTypes.ENUM({
      values: ['user', 'admin']
    }),
    defaultValue: 'user'
  }
}, {
  freezeTableName: true,
  timestamps: false
});

// `sequelize.define` also returns the model
console.log(User === postgresConnection.models.User); // true

module.exports = User;
