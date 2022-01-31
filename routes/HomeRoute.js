const HomeController = require("../controllers/home/home-controller");
const userMiddleware = require("../middlewares/user-middleware");

const router = require("express").Router();

router.get("/", HomeController.HomeGet);
router.get("/mobile-categories", HomeController.getCategories);
router.get("/mobile-banners", HomeController.getBanners);
router.get("/mobile-user",userMiddleware, HomeController.getUsers);
router.get("/mobile-rec", HomeController.getRec);
router.get("/mobile-sale", HomeController.getSale);
router.get("/mobile-best", HomeController.getbestsellers);

module.exports = {
    path: "/",
    router,
};
