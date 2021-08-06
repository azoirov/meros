const UsersController = require("../controllers/users/users-controller");
const dontEnterAuthorized = require('../middlewares/dont-enter-authorized')
const router = require("express").Router();
const FileUpload = require("express-fileupload");

router.post("/check-phone", UsersController.CheckPhone);
router.post("/validate-code", UsersController.ValidateCode);
router.post("/signup", UsersController.Signup);
router.get("/signup", dontEnterAuthorized, UsersController.getSignUp);
router.post("/login", UsersController.Login);
router.get("/login", dontEnterAuthorized, UsersController.getLogin);
router.post('/avatar', FileUpload(), UsersController.AvatarPatchController)
router.post('/edit-full-name', UsersController.EditUserFullName)
router.post('/edit-email-phone', UsersController.EditPhoneEmail)
router.get('/current', async (req, res) => {
    res.json({
        user: req.user
    })
})

router.get("/logout-all", async (req, res) => {
    let sessions = await req.db.sessions.destroy({
        where: {
            user_id: req.user.id
        }
    });

    res.redirect("/users/login")
})

// router.get("/users/delete-account", async (req, res) => {
//     let user = await req.db.users.destroy({
//         where: {
//             user_id: req.user.id
//         }
//     });
//
//     let sessions = await req.db.sessions.destroy({
//         where: {
//             user_id: req.user.id
//         }
//     })
// })


module.exports = {
    path: "/users",
    router,
};
