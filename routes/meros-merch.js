const router = require('express').Router()
const merosMerchGet = require('../controllers/meros-merch/meros-merch-get')

router.get('/', merosMerchGet)

module.exports = {
   path: '/meros-merch',
   router
}