const express = require('express');
const router = express.Router();

// Middleware imports
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Controller imports
const {
  createDelivery,
  getDelivery,
  updateDelivery,
  deleteDelivery,
  uploadProof
} = require('../controllers/deliveryController');

// Route Definitions
router.post('/', /*auth,*/ createDelivery);                            // Create a delivery
router.get('/:id', /*auth,*/ getDelivery);                             // Get one delivery by ID
router.put('/:id', /*auth,*/ updateDelivery);                          // Update delivery fields
router.delete('/:id', /*auth,*/ deleteDelivery);                       // Cancel / delete delivery
router.put('/:id/proof', /*auth,*/ upload.single('proof'), uploadProof); // Upload proof image

module.exports = router;