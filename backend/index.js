
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes'); 

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); 
app.use(bodyParser.json());

// Routes
app.use('/api/bookings', bookingRoutes); 
app.get("/", (req, res) => res.json({ done: 'yes' }));

console.log('Starting server...');

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
