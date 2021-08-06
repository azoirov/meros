const router = require('express').Router()

router.get('/', async (req, res) => {
   res.clearCookie('token').redirect('/')
})

module.exports = {
   path: '/exit',
   router
}