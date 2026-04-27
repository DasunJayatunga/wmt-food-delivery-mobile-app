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
      enum: ['pending', 'picked_up', 'on_the_way', 'delivered', 'cancelled'],
      default: 'pending'
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],                       // [longitude, latitude]
        default: [0, 0]
      }
    },
    deliveryAddress: {
      street: String,
      city: String,
      coordinates: [Number]                   // destination coordinates
    },
    proofImage: {
      type: String,                           // path or URL to uploaded image
      default: null
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

// Geospatial index – enables "near" queries later
deliverySchema.index({ currentLocation: '2dsphere' });

// Create and export the model
module.exports = mongoose.model('Delivery', deliverySchema);
