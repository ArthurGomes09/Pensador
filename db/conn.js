const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('tought','root','Sen@iDev77!.',{
    host:'localhost',
    port:'3306',
    dialect:'mysql'
});
try{
    sequelize.authenticate()
    console.log('Conectado ao MYSQL')
}
catch(error){
    console.log(`Não foi possível conectar ao banco, pois:${error}`)
};
module.exports = sequelize