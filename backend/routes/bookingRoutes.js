// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getAllBookings);

router.get('/accepted', bookingController.getAcceptedBookings);
router.get('/pending', bookingController.getpendingBookings);
router.get('/done', bookingController.getdoneBookings);
router.get('/completed', bookingController.getcompletedBookings);


// getting blocked dates
router.get('/blocked-dates', bookingController.getBlockedDates);

// get the current booking limit
router.get('/limit', bookingController.getBookingLimit);

//  update the booking limit
router.put('/limit', bookingController.updateBookingLimit);

router.put('/:id/status', bookingController.updateBookingStatus);

// Delete a booking by ID
router.delete('/:id', bookingController.deleteBooking);                            

module.exports = router;
