// controllers/bookingController.js
const Booking = require('../models/booking');

// Create a new booking
exports.createBooking = async (req, res) => {
  const { userName, vehicleNumber, phoneNumber, bookingDate, submissionTime } = req.body;

  const booking = new Booking({
    userName,
    vehicleNumber,
    phoneNumber,
    bookingDate,
    submissionTime
  });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
