const express = require("express");
const router = express.Router();
const controllers = require("../controllers/task.controllers");

router.get("/", controllers.index);

router.patch("/change-status/:idTask", controllers.changeStatus);

router.patch("/change-multi", controllers.changeMulti);

router.post("/create", controllers.create);

router.patch("/edit/:idTask", controllers.edit);

router.patch("/delete/:idTask", controllers.delete);


module.exports = router