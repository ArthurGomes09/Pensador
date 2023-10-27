const express = require('express')
const router = express.Router()
const checkAuth = require('../helpers/auth').checkAuth
//importar o controlador de pensamentos tought
const ToughtController = require('../controllers/ToughtController')
router.get('/dashboard', checkAuth, ToughtController.dashboard)
router.get('/add', checkAuth, ToughtController.createTought)
router.post('/add', checkAuth, ToughtController.createToughtSave)
router.get('/edit/:id', checkAuth, ToughtController.editTought)
router.post('/edit/:id', checkAuth, ToughtController.editToughtSave)
router.post('/remove', checkAuth, ToughtController.removeToughtSave)
router.get('/', ToughtController.showToughts)

//Exportar a rota
module.exports = router
