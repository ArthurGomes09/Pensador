const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const User = db.define('User', {
  id:{
    primaryKey: true,
    type:DataTypes.INTEGER,
    allowNull:false,
    require:true,
    autoIncrement:true
  },
  name:{
    type:DataTypes.STRING,
    allowNull:false,
    require: true
  },
  email:{
    type:DataTypes.STRING,
    allowNull:false,
    require: true
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false,
    require: true
  }
})

module.exports = User
