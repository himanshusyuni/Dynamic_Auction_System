const mongoose = require('mongoose');

const bidderNodeSchema = mongoose.Schema({
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bidAmount: {
        type: Number,
        required: true
    },
    prev: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BidderNode'
    },
    next: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BidderNode'
    }
});

const BidderNode = mongoose.model('BidderNode', bidderNodeSchema);
module.exports = BidderNode;
