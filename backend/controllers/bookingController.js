const Booking = require('../models/booking');
const BookingLimit = require('../models/bookingLimit');

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
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
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