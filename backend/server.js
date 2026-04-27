require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// A simple health check route
app.get('/', (req, res) => {
  res.json({ message: 'Food Delivery API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
