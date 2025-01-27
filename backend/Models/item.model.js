const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: [true, "Item name is necessary"]
    },
    itemPics: [{
        type: String,
        required: [true, "At least 1 photo is needed"]
    }],
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
    auctionTimeRemaining: {
        type: Number,
        required: [true, "Auction duration is required"]
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
    }
}, { timestamps: true });


const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
