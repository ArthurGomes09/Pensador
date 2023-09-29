const Tought = require('./models/Tought')

module.exports = class ToughtController{
  static createTought(req,res){
    return res.render('tought/create')
  }
  static async showTought(req,res){
    const tought = await tought.findAll({raw:true})
    return res.render('tought/all', {tought})
  }
}