const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')//criar a sessão do usuário
const Filestore = require('session-file-store')(session)
const flash = require('express-flash')
const GATE = 3334
const app = express()

const conn = require('./db/conn')

//Models
const User = require('./models/User')
const Tought = require('./models/Tought')

//Import Engine
app.engine('handlebars', exphbs.engine)
app.set('view engine','handlebars')

//Importar JSON
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//Importar middleware para o controle de sessões
app.use(session({
  name:'session',
  secret:'nosso_segredo',
  resave: false,
  saveUninitialized: false,
  store: new Filestore({
    logFn:function() {},
    path: require('path').join(require('os').tmpdir(),'sessions')
  }),
  cookie:{
    secure: false,
    maxAge: 360000,
    expires: new Date(Date.now() + 360000),
    httpOnly: true,
  }
}))
//Importar as flash Messages
app.use(flash())

//Importar arquivos estáticos
app.use(express.static('public'))

//Middleware para armazenar sessões na resposta
app.use((req,res, next)=>{
  if(req.session.userId){
    res.locals.session = req.session
  }
  next()
})
//rotas
app.use('/tought', toughtsRouters)

conn
  .sync()
  .then(()=>{
    app.listen(GATE)
  })
  .catch((err)=>{
    console.log(err)
  })