const express =require('express');
const router = express.Router();

//creating new auction 
router.post('/create',(req,res)=>{

});

//fetching info of existing auction
router.get('/:auctionid',(req,res)=>{
    const auctionId= req.params.auctionid;
});

//fetching all auctions based on  live or completed
router.get('/',(req,res)=>{
    const {status} = req.query;

});

// updating auction
router.patch('/:auctionid',(req,res)=>{

});

//deleting auction
router.delete('/:auctionid',(req,res)=>{

});

module.exports= router;