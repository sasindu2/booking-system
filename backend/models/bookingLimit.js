const mongoose = require('mongoose');

const BookingLimitSchema = new mongoose.Schema({
  limit: {
    type: Number,
    required: true,
    min: 1
  }
});

module.exports = mongoose.model('BookingLimit', BookingLimitSchema);