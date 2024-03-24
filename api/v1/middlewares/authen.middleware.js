const User = require("../models/user.model");

module.exports.requireAuthen = async (req, res, next)=>{   
    if(!req.headers.authorization){
        
        res.json({
            code: 400,
            message: "Send to token in the headers"
        });
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
        token: token
    }).select("-password -token");
    if(!user){
        res.json({
            code: 400,
            message: "Token invalid !"
        });
        return;
    };

    res.user = user

    next();
}