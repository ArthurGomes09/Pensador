const Tought = require('../models/Tought')
const User = require('../models/User')
//importar o middleware de autenticação do user

module.exports = class ToughtController{
  static async showToughts(request, response){
    return response.render('toughts/home')//Mostrando um view
  }
  static async dashboard(req,res){
    const userId = req.session.userId
    const pensamentoUser = await User.findOne({
      where:{
        id:userId
      },
      include:Tought,
      plain:true
    })
    if(!pensamentoUser){
      res.redirect('/login')
    }

    const toughts = pensamentoUser.Toughts.map((result) => result.dataValues);
    console.log(toughts);

    return res.render('toughts/dashboard', {toughts});
  }
  static createTought(req,res){
    return res.render('toughts/create')
  }
  static async createToughtSave(req,res){
   const tought = {
    title: req.body.title,
    userId: req.session.userId
   } 
   try {
    await Tought.create(tought)
    req.flash('message', 'Pensamento criado com sucesso!')
    req.session.save(()=>{
      res.redirect('/toughts/dashboard')
    })
   } catch (error) {
    console.log(`Aconteceu um erro: ${error}`)
   }
  }
};

