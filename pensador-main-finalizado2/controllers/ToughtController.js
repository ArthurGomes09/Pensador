const { request } = require('express');
const { where } = require('sequelize');
const Tought = require('../models/Tought')
const User = require('../models/User')
const { Op } = require('sequelize')
//importar o middleware de autenticação do user

module.exports = class ToughtController{
  static async showToughts(request, response){

    let search = ''
    if(request.query.search){
      search = request.query.search
    }
    console.log(search)
    let order = 'DESC'

    if(request.query.order === 'old'){
      order = "ASC"
    }else{
      order = "DESC"
    }
    const toughtsData = await Tought.findAll({
      include: User,
      where:{
        title:{[Op.like]: `%${search}%`},
      },
      order:[['CreatedAt', order]]
    })
    const toughts = toughtsData.map((result)=>result.get({plain:true}))
    // console.log(toughts)
    const toughtsQty = toughts.length
    return response.render('toughts/home', {toughts, search, toughtsQty})//Mostrando um view
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
  static async editTought(request, response) {
    try {
      const tought = await Tought.findOne({ where: { id: request.params.id }, raw: true })

      console.log(tought);

      return response.render('toughts/edit', { tought: tought })
    } catch (error) {
      console.error('Não foi possível encontrar o pensamento, erro' + error)
    }
  }
  static async editToughtSave(request, response) {
    try {
      await Tought.update({ title: request.body.title }, { where: { id: request.params.id } })
      request.session.save(()=>{
        return response.redirect('/toughts/dashboard')
      })
    } catch (error) {
      console.error('Não foi possível editar o pensamento, erro' + error)
    }
  }
}
