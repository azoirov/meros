const router = require('express').Router()
const resetPasswordGet = require('../controllers/reset-password/reset-password-get')
const resetPasswordPhonePost = require('../controllers/reset-password/reset-password-phone-post')
const resetPasswordCodePost = require('../controllers/reset-password/reset-password-code-post')
const resetPasswordNewGet = require('../controllers/reset-password/reset-password-new-get')
const resetPasswordNewPost = require('../controllers/reset-password/reset-password-new-post')
const dontEnterAuthorized = require('../middlewares/dont-enter-authorized')

router.get('/', dontEnterAuthorized, resetPasswordGet)

router.post('/phone', dontEnterAuthorized, resetPasswordPhonePost)

router.post('/code', dontEnterAuthorized, resetPasswordCodePost)

router.get('/new', dontEnterAuthorized, resetPasswordNewGet)

router.post('/new', dontEnterAuthorized, resetPasswordNewPost)

module.exports = {
   path: '/reset-password',
   router
}