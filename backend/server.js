require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ---------- DELIVERY ROUTES ----------
app.use('/api/delivery', require('./routes/delivery'));

// ---------- PAYMENT ROUTES ----------
app.use('/api/payment', require('./routes/payment'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});