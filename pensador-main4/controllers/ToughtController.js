const { request } = require('express');
const { where } = require('sequelize');
const Tought = require('../models/Tought')
const User = require('../models/User')
//importar o middleware de autenticação do user

module.exports = class ToughtController{
  static async showToughts(request, response){
    return response.render('toughts/home')//Mostrando um view
  };
  static async dashboard(req,res){
    const user = await User.findOne({
      where:{
        id: req.session.userId
      },
      include:Tought,
      plain:true
    })
    
    if(user.Toughts.lenght == 0){
      req.flash('message', 'Você ainda não publicou nenhum pensamento!')
      return res.render('/login')
    }
    const toughts = user.Toughts.map((result) => result.dataValues);
    return res.render('toughts/dashboard', {toughts:toughts})
  };
  static createTought(req,res){
    return res.render('toughts/create')
  };
  static async createToughtSave(req,res){
   const tought = {
    title: req.body.title,
    UserId: req.session.userId
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
  };
  static async removeToughtSave(req,res){
    const {id} = req.body
    console.log(id)
    const userId = req.session.userId
    try {
      await Tought.destroy({where:{id:id, UserId:userId}})
      req.flash("message", "Pensamento excluído com sucesso!")

      req.session.save(()=>{
        res.redirect('/toughts/dashboard')
      })
    } catch (error) {
      console.log(`Aconteceu um erro: ${error}`)
    }
  };
}
