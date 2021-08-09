const {
   CartAddController,
   CartPlusPatchController,
   CartMinusPatchController,
   cartGetController,
   CheckoutGetController,
    CartDeleteController
} = require("../controllers/product/product-controller");
const dontEnterNotAuthorized = require('../middlewares/dont-enter-not-authorized')

const router = require("express").Router();

router.post("/add", CartAddController);
router.patch("/api/plus", CartPlusPatchController);
router.patch("/api/minus", CartMinusPatchController);
router.get('/', dontEnterNotAuthorized, cartGetController)
router.get('/checkout', dontEnterNotAuthorized, CheckoutGetController)
router.delete("/cart", CartDeleteController)

module.exports = {
   path: "/cart",
   router,
};
