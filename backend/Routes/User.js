const express=  require('express');
const Authenticate = require('../Middlewares/authenticate');
const router= express.Router();

const User = require('../Models/user.model')
// user information
router.get('/profile', Authenticate , async (req,res)=>{

    try{
    const user= await User.findOne({email : req.user.email}).select('-password');

    if(!user){
        console.log("USER NOT FOUND");
        return res.status(401).json({
            message:"USER NOT FOUND"
        });
    }
    console.log(user);
    res.json({user});
}
catch(err){
    console.log(err);
    res.status(401).json({
        message:"ERROR while fetching info"
    });
}


});
module.exports= router;