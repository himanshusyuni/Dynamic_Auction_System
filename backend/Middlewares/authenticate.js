const jwt = require('jsonwebtoken');
const Authenticate = async (req,res,next)=>{

    const token= req.header('Authorization')?.replace('Bearer ','');
    if(!token){
        return res.status(401).json({
            message:"Please Login in"
        });
    }

    try{
        const decoded= await jwt.verify(token,process.env.JWT_SECRET);
        req.user= decoded;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({
            message:"Error while authenticating"
        });
    }

}
module.exports = Authenticate;