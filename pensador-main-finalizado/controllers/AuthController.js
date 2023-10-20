const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController{
  static login(request, response){
    return response.render('auth/login')
  }
  static async loginPost(req,res){
   const {email, password} = req.body
   const user = await User.findOne({where:{email:email}}) //se usuário existe Math User
   if(!user){
    req.flash('message','Usuário não encontrado')
    res.render('auth/login')
    return
   } 
   //validar a senha do user
   const passwordMatch = bcrypt.compareSync(password, user.password)
   if(!passwordMatch){
    req.flash('message','Senha inválida!')
    res.render('auth/login')
    return
   }
   req.session.userId = user.id;
   req.flash('message','Bem vindo!')
   req.session.save(()=>{
    res.redirect('/')
   })
  }
  static register(request, response){
    return response.render('auth/register')
  }
  static async registerPost(req, res){
    const {name,email,password,confirmpassword} = req.body

    //1° - validação de senha - password math
      if(password != confirmpassword){
        // mensagem informando ao usuário o problema
        req.flash('message', 'As senhas não conferem, tente novamente...')
        res.render('auth/register')
        return
      }
    //2° - validação de email -
      const checkedIfExists = await User.findOne({where:{email:email}})
      if(checkedIfExists){
        req.flash('message', 'O email já está em uso! tente novamente...')
        res.render('auth/register')
        return
      }
    //3° - criptografia do password -
      // salt -> quantidade de caracteres extras na criptografia
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(password, salt)
    //4° - criar usuário no banco -
      const user = {
        name,
        email,
        password:hashedPassword
      }
      try {
        const createdUser = await User.create(user)

        req.session.userId = createdUser.id

        req.flash('message', 'Cadastro realizado com sucesso!')

        req.session.save(()=>{
          res.redirect('/')
        })
      } catch (error) {
        console.log(error)
      }
    //5° - regra de negócio do app -
  }
  static async logout(req,res){
    req.session.destroy()
    return res.redirect('/login')
  }
}
