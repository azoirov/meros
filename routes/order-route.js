const {
    SingleOrderController,
    BulkOrderController,
} = require("../controllers/order/order-controller");

const router = require("express").Router();

router.post("/single", SingleOrderController);
router.post("/bulk", BulkOrderController);

module.exports = {
    path: "/order",
    router,
};
