const HomeController = require("../controllers/home/home-controller");

const router = require("express").Router();

router.get("/", HomeController.HomeGet);

module.exports = {
    path: "/",
    router,
};
