const taskRouter = require("./task.routers");
const userRouter = require("./user.router");
const requireAuthen = require("../middlewares/authen.middleware");

module.exports = (app)=>{
    const version = "/api/v1"

    app.use(version + "/task",requireAuthen.requireAuthen,taskRouter);

    app.use(version + "/user",userRouter);

}