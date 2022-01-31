const router = require('express').Router()
const { SingleProductGetController , SingleProductMobile} = require("../controllers/product/product-controller")

router.get('/:product_slug', SingleProductGetController)
router.get('/one/:product_id', SingleProductMobile)

module.exports = {
    path: '/product',
    router
}