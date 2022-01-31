const router = require('express').Router()

router.get('/', async (req, res) => {
    res.render('categories', {
        title: 'Meros | Categories',
        path: '/categories',
        user: req.user,
        categories: req.categories,
        user: req.user,
        categories: req.categories,
        lang: req.lang,
        data: req.data
    })
})

module.exports = {
    path: '/categories',
    router
}