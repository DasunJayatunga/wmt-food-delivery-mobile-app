const express = require('express');
const router = express.Router();
const { getCart, removeCartItem } = require('../controllers/cartController');

router.get('/:userId', getCart);
router.delete('/:userId/item/:itemId', removeCartItem);

module.exports = router;