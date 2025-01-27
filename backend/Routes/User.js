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
   
    res.json({user});
}
catch(err){
    console.log(err);
    res.status(401).json({
        message:"ERROR while fetching info"
    });
}


});
router.patch('/profile', async (req, res) => {
    try {
        const { email, username, dob, address } = req.body;
       
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"  // Use 404 for "not found"
            });
        }

        // Update the user's fields
        user.username = username || user.username;  // Retain existing value if not provided
        user.dob = dob || user.dob;
        user.address = address || user.address;

        // Save the updated user
        await user.save();

        // Send a success response
        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        // Handle any errors
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

module.exports= router;