const router = require("express").Router();
const FileUpload = require("express-fileupload");
const { CommentsPostController } = require("../controllers/product/product-controller");

router.post("/", FileUpload(), CommentsPostController);

module.exports = {
    path: "/comment",
    router,
};
