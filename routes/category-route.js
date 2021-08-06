const router = require('express').Router()

router.get('/', async (req, res) => {
   const categories = await req.db.categories.findAll()

   res.render('sub-category', {
      title: 'Meros | Category',
      path: '/category',
      user: req.user,
      categories
   })
})

module.exports = {
   path: '/category',
   router
}