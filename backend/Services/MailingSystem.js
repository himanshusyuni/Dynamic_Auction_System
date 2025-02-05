const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use Gmail's SMTP service
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD // Your Gmail app password
  }
});

const sendMail = async (to, subject, body) => { // Renamed "text" to "body"
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // Receiver address
    subject, // Subject of the email
    html: body // Corrected to use "body"
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email: ${error}`);
  }
};

module.exports = sendMail;
