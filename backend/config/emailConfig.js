//emailConfig.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendBookingEmail = async (bookingData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Booking Notification - St\'Anns Service',
    html: `
      <h2>New Booking Details</h2>
      <p><strong>User Name:</strong> ${bookingData.userName}</p>
      <p><strong>Vehicle Number:</strong> ${bookingData.vehicleNumber}</p>
      <p><strong>Phone Number:</strong> ${bookingData.phoneNumber}</p>
      <p><strong>Booking Date:</strong> ${new Date(bookingData.bookingDate).toLocaleDateString()}</p>
      <p><strong>Submission Time:</strong> ${new Date(bookingData.submissionTime).toLocaleString()}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendBookingEmail };