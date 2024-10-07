const Booking = require('../models/booking');

// Get blocked dates (dates with 5 or more bookings)
exports.getBlockedDates = async (req, res) => {
  try {
    const blockedDates = await Booking.aggregate([
      {
        $group: {
          _id: "$bookingDate",
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gte: 5 }
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
    // Check if the date is already fully booked
    const bookingsCount = await Booking.countDocuments({ bookingDate });
    if (bookingsCount >= 5) {
      return res.status(400).json({ message: 'This date is fully booked' });
    }
    

    const booking = new Booking({
      userName,
      vehicleNumber,
      phoneNumber,
      bookingDate,
      submissionTime
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