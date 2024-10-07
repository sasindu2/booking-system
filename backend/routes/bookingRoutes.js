// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getAllBookings);

// New route for getting blocked dates
router.get('/blocked-dates', bookingController.getBlockedDates);

module.exports = router;
