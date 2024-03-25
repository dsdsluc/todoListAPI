const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controllers");
const authenMiddleware = require("../middlewares/authen.middleware")

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otp);

router.post("/password/reset", controller.reset);

router.get("/detail",authenMiddleware.requireAuthen, controller.detail);

router.get("/list",authenMiddleware.requireAuthen, controller.list);



module.exports = router