const router = require('express').Router()
const booksGet = require('../controllers/books/books-get')

router.get('/', booksGet)

module.exports = {
    path: '/books',
    router
}