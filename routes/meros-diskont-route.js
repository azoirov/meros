const router = require('express').Router()
const merosDiskontGet = require('../controllers/meros-diskont/meros-diskont-get')

router.get('/', merosDiskontGet)

module.exports = {
   path: '/meros-diskont',
   router
}