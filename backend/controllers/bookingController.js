const Booking = require('../models/booking');
const BookingLimit = require('../models/bookingLimit');
// const Booking = require('../models/bookingModel');
// Get blocked dates (dates with 5 or more bookings)
exports.getBlockedDates = async (req, res) => {
  try {

    const limitDoc = await BookingLimit.findOne();
    const limit = limitDoc ? limitDoc.limit : 5;

    const blockedDates = await Booking.aggregate([
      {
        $group: {
          _id: "$bookingDate",
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gte: limit }
        }
      }
    ]);

    res.json(blockedDates.map(date => date._id));
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    res.status(500).json({ message: 'Error fetching blocked dates' });
  }
};

// Modify the existing createBooking function
exports.createBooking = async (req, res) => {
  const { userName, vehicleNumber, phoneNumber, bookingDate, submissionTime } = req.body;

  try {
    const limitDoc = await BookingLimit.findOne();
    const limit = limitDoc ? limitDoc.limit : 5;
    // Check if the date is already fully booked
    const bookingsCount = await Booking.countDocuments({ bookingDate });
    if (bookingsCount >= limit) {
      return res.status(400).json({ message: 'This date is fully booked' });
    }
    

    const booking = new Booking({
      userName,
      vehicleNumber,
      phoneNumber,
      bookingDate,
      submissionTime,
      status:'pending'
    });

    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Keep the existing getAllBookings function
// In your bookingController.js
exports.getAllBookings = async (req, res) => {
  try {
    const status = req.query.status; // Get the status from the query parameter
    let bookings;
    if (status === 'accept') {
      bookings = await Booking.find({ status: 'accept' }); // Filter for accepted bookings
    } else {
      bookings = await Booking.find(); // Return all bookings if no status is specified
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//  get the current booking limit
exports.getBookingLimit = async (req, res) => {
  try {
    const limitDoc = await BookingLimit.findOne();
    const limit = limitDoc ? limitDoc.limit : 5; // Default to 5 if not set
    res.json({ limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  update the booking limit
exports.updateBookingLimit = async (req, res) => {
  const { limit } = req.body;

  if (!limit || limit < 1) {
    return res.status(400).json({ message: 'Invalid limit value' });
  }

  try {
    let limitDoc = await BookingLimit.findOne();
    if (limitDoc) {
      limitDoc.limit = limit;
    } else {
      limitDoc = new BookingLimit({ limit });
    }
    await limitDoc.save();
    res.json({ message: 'Booking limit updated successfully', limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status' });
  }
};


exports.getAcceptedBookings = async (req, res) => {
  try {
    const acceptedBookings = await Booking.find({ status: 'accept' });
    res.json(acceptedBookings);
  } catch (error) {
    console.error('Error fetching accepted bookings:', error);
    res.status(500).json({ message: 'Error fetching accepted bookings' });
  }
};
exports.getpendingBookings = async (req, res) => {
  try {
    const pendingBookings = await Booking.find({ status: 'pending' });
    res.json(pendingBookings);
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    res.status(500).json({ message: 'Error fetching pending bookings' });
  }
};
exports.getdoneBookings = async (req, res) => {
  try {
    const doneBookings = await Booking.find({ status: 'done' });
    res.json(doneBookings);
  } catch (error) {
    console.error('Error fetching done bookings:', error);
    res.status(500).json({ message: 'Error fetching done bookings' });
  }
};
exports.getcompletedBookings = async (req, res) => {
  try {
    const completedBookings = await Booking.find({ status: 'completed' });
    res.json(completedBookings);
  } catch (error) {
    console.error('Error fetching completed bookings:', error);
    res.status(500).json({ message: 'Error fetching completed bookings' });
  }
};

//delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error while deleting booking' });
  }
};




