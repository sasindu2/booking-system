// models/booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
