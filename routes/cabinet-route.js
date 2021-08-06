const router = require('express').Router()
const {
   cabinetGet,
   cabinetEditGet,
   savedCardsGet,
   ordersGet,
   boughtProductsGet,
   regularDeliveriesGet,
   notificationSettingsGet,
   myDetailsGet
} = require('../controllers/cabinet/cabinet-get')

const dontEnterNotAuthorized = require('../middlewares/dont-enter-not-authorized')

router.get('/', dontEnterNotAuthorized, cabinetGet)

router.get('/edit', dontEnterNotAuthorized, cabinetEditGet)

router.get('/saved-cards', dontEnterNotAuthorized, savedCardsGet)

router.get('/orders', dontEnterNotAuthorized, ordersGet)

router.get('/bought-products', dontEnterNotAuthorized, boughtProductsGet)

router.get('/regular-deliveries', dontEnterNotAuthorized, regularDeliveriesGet)

router.get('/notification-settings', dontEnterNotAuthorized, notificationSettingsGet)

router.get('/my-details', dontEnterNotAuthorized, myDetailsGet)

module.exports = {
   path: '/cabinet',
   router
}