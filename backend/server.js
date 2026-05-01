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

// ---------- INVOICE ROUTES ----------
app.use('/api/invoice', require('./routes/invoice'));

// ---------- CART ROUTES ----------
app.use('/api/cart', require('./routes/cart'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});