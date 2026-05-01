const mongoose = require('mongoose');

// Define the schema
const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,   // reference to another document
      ref: 'Order',                           // the model it refers to
      required: true
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',                            // assume a User model exists
      default: null
    },
    status: {
      type: String,
      enum: [
        'confirmed',            // order confirmed
        'preparing',            // order being prepared
        'sent_to_delivery',     // order sent to delivery driver
        'waiting_for_pickup',   // driver waiting to pick up
        'on_the_way',           // out for delivery
        'delivered',            // finished
        'cancelled'
      ],
      default: 'confirmed'
    },
    deliveryAddress: {
      street: String,
      city: String,
      coordinates: [Number]                   // destination coordinates
    },
    estimatedTime: {
      type: String,                           // human‑readable ETA
      default: null
    }
  },
  {
    timestamps: true   // automatically adds createdAt & updatedAt
  }
);

// Create and export the model
module.exports = mongoose.model('Delivery', deliverySchema);
