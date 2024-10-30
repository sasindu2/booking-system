// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getAllBookings);

// getting blocked dates
router.get('/blocked-dates', bookingController.getBlockedDates);

// get the current booking limit
router.get('/limit', bookingController.getBookingLimit);

//  update the booking limit
router.put('/limit', bookingController.updateBookingLimit);

module.exports = router;
