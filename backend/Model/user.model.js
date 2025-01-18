const bcrypt= require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is necessary"],
        },
    password:{
        type:String,
        required:[true,"Password is necessary"],
        minlength:6
    },
    userPic:{
        type:String,
        default:"user.img"
    },
    email: {
        type: String,
        required: [true, "Email is necessary"],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    
    purchasedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }],
    soldItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }]
    

}, { timestamps: true })

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model("User",userSchema);
module.exports = User;