const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: [
        'confirmed',
        'preparing',
        'sent_to_delivery',
        'waiting_for_pickup',
        'on_the_way',
        'delivered',
        'cancelled'
      ],
      default: 'confirmed'
    },
    address: {
      type: String,
      required: true
    },
    // File upload requirement – keep this field (even if you don’t “track” it)
    proofImage: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
