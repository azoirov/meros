const router = require('express').Router()
const { SingleProductGetController } = require("../controllers/product/product-controller")

router.get('/:product_slug', SingleProductGetController)

module.exports = {
    path: '/product',
    router
}