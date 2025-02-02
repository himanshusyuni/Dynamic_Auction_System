const express = require('express');
const router = express.Router();
const Item = require('../Models/item.model');
const jwt = require('jsonwebtoken');
const BidderNode = require('../Models/bidderNode.model');
const User = require('../Models/user.model');
const Authenticate = require('../Middlewares/authenticate');
const sendMail = require('../Services/MailingSystem');

// Creating new auction
router.post('/create', async (req, res) => {
  const { itemName, itemPic, auctionTime, tags, description, currPrice, token } = req.body;

  let email, id;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    email = decoded.email;
    id = decoded.id;

    if (!id) {
      return res.status(401).json({ message: 'Invalid user information in token' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Create the starting bidder node
    const startingNode = await new BidderNode({
      bidder: id,
      bidAmount: currPrice,
      prev: null,
      next: null,
    });

    // Create the item and assign the bidder node
    const item = await new Item({
      itemName,
      itemPic,
      auctionTime,
      tags,
      description,
      currPrice,
      sellerEmail: email,
      biddersListHead: startingNode._id,
      biddersListTail: startingNode._id,
    });
    await startingNode.save();
    await item.save();

    const subject = 'Your Auction for ' + itemName + ' is Live!';
    const body = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
        <p>Hi there,</p>
  
        <p style="font-size: 16px; font-weight: bold;">Congratulations!</p>
        <p>Your auction for the item <strong>"${itemName}"</strong> is now live. Bidders can start placing their bids.</p>
  
        <p>When the auction ends, you will receive an email with the final details of the highest bid and the winner.</p>
  
        <p>Thank you for choosing our platform!</p>
  
        <br />
        <p style="font-style: italic;">Best regards,</p>
        <p style="font-weight: bold;">Auction System</p>
      </body>
    </html>
  `;
  
    sendMail(email, subject, body);
    console.log('Auction created successfully:', item);
    res.status(201).json({ message: 'Auction created successfully' });
  } catch (err) {
    console.error('Error creating auction:', err);
    res.status(500).json({ message: 'Failed to create auction' });
  }
});

// Fetching info of existing auction
router.get('/:auctionid', async (req, res) => {
  const auctionId = req.params.auctionid;
  try {
    const item = await Item.findOne({ _id: auctionId });
    if (!item) {
      return res.status(401).json({ message: 'ITEM NOT FOUND' });
    }
    const highestBidder = await BidderNode.findOne({ _id: item.biddersListTail });
    const user = await User.findOne({ _id: highestBidder.bidder });
    res.status(201).json({ item, user });
  } catch (err) {
    res.status(401).json({ message: 'Error in item fetching' });
  }
});

router.get('/', async (req, res) => {
  console.log('Fetching Auction Data');

  try {
    const AuctionList = await Item.find(); // Fetch all auction items

    for (let item of AuctionList) {
      const auctionEndTime = new Date(item.createdAt).getTime() + item.auctionTime * 60 * 60 * 1000; // Convert auctionTime (hours) to milliseconds

      if (item.auctionStatus === 'live' && auctionEndTime <= Date.now()) {
        const node = await BidderNode.findOne({ _id: item.biddersListTail });
        const user = await User.findOne({ _id: node.bidder });

        let check = true;
        if (user.email === item.sellerEmail) {
          check = false;
        }

        if (check) {
          item.auctionStatus = 'sold';
          await item.save();
        } else {
          item.auctionStatus = 'unsold';
          await item.save();
        }

        const subject = 'The Auction Has Ended for ' + item.itemName;
        const body = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
            <p>Hello,</p>
      
            <p style="font-size: 16px; font-weight: bold;">The auction for your item <strong>"${item.itemName}"</strong> has ended.</p>
      
            <p>You can check the results, including the highest bid and the winner, by visiting our website.</p>
      
            <p>Thank you for using our platform!</p>
      
            <br />
            <p style="font-style: italic;">Best regards,</p>
            <p style="font-weight: bold;">Auction System</p>
          </body>
        </html>
      `;
      
        sendMail(user.email, subject, body);
      }
    }

    res.status(201).json({ AuctionList });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: 'Error in fetching the auction list',
    });
  }
});

// Updating auction
router.patch('/:auctionid', Authenticate, async (req, res) => {
  const auctionId = req.params.auctionid;

  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: 'USER NOT FOUND',
      });
    }

    const { currPrice } = req.body;
    const item = await Item.findOne({ _id: auctionId });
    item.currPrice = currPrice;

    const prevNode = await BidderNode.findOne({ _id: item.biddersListTail });
    const Node = await new BidderNode({
      bidder: user.id,
      bidAmount: currPrice,
      prev: prevNode._id,
      next: null,
    });

    console.log('Nodes created', user);
    await Node.save();
    console.log(Node);

    prevNode.next = Node._id;
    await prevNode.save();
    console.log(prevNode);

    item.biddersListTail = Node._id;
    await item.save();
    console.log('DONE', item);
    res.status(201).json({ message: 'Bid placed' });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: 'Error while bidding',
    });
  }
});

module.exports = router;
