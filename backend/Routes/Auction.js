const express =require('express');
const router = express.Router();
const Item = require("../Models/item.model")
const jwt= require("jsonwebtoken");
//creating new auction 
router.post('/create',async (req,res)=>{
    console.log(req.body);
    const {itemName,itemPic,auctionTime,tags,description,currPrice,token} = req.body;

    const  decoded= await jwt.verify(token,process.env.JWT_SECRET);
    const email = decoded.email;

    try{
        console.log("HELLO");
    const item = await new Item({
        itemName,itemPic,auctionTime,tags,description,currPrice,
        sellerEmail:email
    });
    await item.save();
    res.status(201).json({
        message:"AUCTION CREATED"
    });
}catch(err){
    console.log(err);
    res.status(401).json({
        message:"ITEM NOT CREATED"
    });
}

});

//fetching info of existing auction
router.get('/:auctionid',async (req,res)=>{
    const auctionId= req.params.auctionid;
    try{
        const item = await Item.findOne({_id:auctionId});
        if(!item){
            res.status(401).json({message:
                "ITEM NOT FOUND"
            });
        }
        res.status(201).json({item});
    }catch(err){
        res.status(401).json({message:
            "Error in item fetching"
        });
    }
});

router.get('/',async (req,res)=>{
    console.log("Fetching Auction Data");

    try{
        const AuctionList = await Item.find();
        console.log(AuctionList);
        res.status(201).json({
           AuctionList
        });

    }catch(err){
        console.log(err);
        res.status(401).json({
            message:"Error in fecthing the auction list"
        });
    }

});

// updating auction
router.patch('/:auctionid',(req,res)=>{

});

//deleting auction
router.delete('/:auctionid',(req,res)=>{

});

module.exports= router;