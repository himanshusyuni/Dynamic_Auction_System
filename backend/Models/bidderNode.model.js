const mongoose = require('mongoose');

// Schema for a single node in the doubly linked list
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
        type: mongoose.Schema.Types.ObjectId, // Reference to the previous node
        ref: 'BidderNode'
    },
    next: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the next node
        ref: 'BidderNode'
    }
});

const BidderNode = mongoose.model('BidderNode', bidderNodeSchema);
module.exports = BidderNode;
