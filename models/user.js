'use strict';

const bcrypt = require(`bcryptjs`)

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Todo)
    }
  };
  User.init({
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        isEmail:{
          args: true,
          msg: "Invalid email format"
        }
      }
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

User.beforeCreate((instanceUser)=>{
  let salt = bcrypt.genSaltSync(10);
  instanceUser.password = bcrypt.hashSync(instanceUser.password,salt)
})

  return User;
};