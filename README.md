# Dynamic_Auction_System


Functional requirements
1.	Sign in/ login
2.	Search option for items
3.	Users can add the items they want to sell + adding the auctions details
4.	User can bid the amount higher than the current bid price/starting price
5.	When the auction will end, the winner and the seller will get a mail.
6.	The winner will be given 2 hours to complete the payment.
7.	If the winner is not able to complete the payment in that time, The next higher bidder will win and same process.
8.	If there is no bidder or all bidder unable to complete the payment, then the item will remain unsold.

Challenges
1.	If two users bid the same amount at the same time.

PAGES
1.	User profile
•	Display picture , name , joining date, email id
•	Auctions Participated+Status
•	Items sold
2.	Main page 
•	Live auction
•	Completed auction
3.	Item auction page 
•	Item picture, name , seller , start price
•	Bidding option
4.	Sign In/Signup 


SCHEMA
1)	USER
•	userID
•	userPic
•	username
•	password
•	joiningDate
•	email
•	purchasedItems (array of itemID sorted by date+time)
•	soldItems (array of itemID sorted by date+time)

2)	ITEM
•	itemID
•	itemPic
•	itemName 
•	auctionStatus (enum of {live, payment, finished}  ]});
•	finished (sold,unsold)
•	biddersList (doubly Linked list of Object ({ userID, betAmt,timestamp,bidStatus :{live,won,lost,payment failed}}): - starting bidder (seller))
•	biddersMap (userId linkedList Node)
•	paymentStatus (pending,paid)
•	auctionTimeRemaining
•	paymentTimeRemaining









