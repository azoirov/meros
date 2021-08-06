const {
   CartAddController,
   CartPlusPatchController,
   CartMinusPatchController,
   CartGetController,
   CheckoutGetController
} = require("../controllers/product/product-controller");
const dontEnterNotAuthorized = require('../middlewares/dont-enter-not-authorized')

const router = require("express").Router();

router.post("/add", CartAddController);
router.patch("/api/plus", CartPlusPatchController);
router.patch("/api/minus", CartMinusPatchController);
router.get('/', dontEnterNotAuthorized, CartGetController)
router.get('/checkout', dontEnterNotAuthorized, CheckoutGetController)

module.exports = {
   path: "/cart",
   router,
};
