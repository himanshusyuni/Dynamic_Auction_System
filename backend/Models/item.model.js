const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    itemName:String,

    itemPic: {
        type: String,
        
    },
    auctionStatus: {
        type: String,
        enum: ['live', 'sold', 'unsold', 'payment'], 
        default: 'live'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending'],
        default: 'pending'
    },
    paymentTimeRemaining: {
        type: Number
    },
    biddersListHead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BidderNode'
    },
    biddersListTail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BidderNode'
    },
    biddersMap: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,  // The value is the ObjectId of BidderNode
        default: {}
    },
    auctionTime:{
        type:Number,
        default:24,
    },
    description:String,
    tags:[{type:String}],
    currPrice:{
        type:Number,
        required:[true,"Price is needed"]
    },
    sellerEmail:{
        type:String,
        required:[true,"Seller mail is required"]
    }
}, { timestamps: true });


const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
