const router = require('express').Router()

router.get('/', async (req, res) => {
    const categories = await req.db.categories.findAll()

    res.render('categories', {
        title: 'Meros | Categories',
        path: '/categories',
        user: req.user,
        categories
    })
})

module.exports = {
    path: '/categories',
    router
}