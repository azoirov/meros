const {
    WishListAddController,
    WishlistDeleteController,
    WishListGetController,
} = require("../controllers/product/product-controller")
const dontEnterNotAuthorized = require('../middlewares/dont-enter-not-authorized')

const router = require("express").Router();

router.post("/", WishListAddController);
router.delete("/", WishlistDeleteController);
router.get("/", dontEnterNotAuthorized, WishListGetController)

module.exports = {
    path: "/wishlist",
    router,
};
