const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

let userCarts = {}; // In-memory cart storage for simplicity

// Add to Cart
router.post('/', auth, (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!userCarts[userId]) userCarts[userId] = [];
    const existingItem = userCarts[userId].find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        userCarts[userId].push({ productId, quantity });
    }

    res.json(userCarts[userId]);
});

// View Cart
router.get('/', auth, (req, res) => {
    const userId = req.user.id;
    res.json(userCarts[userId] || []);
});

// Update Cart Item
router.put('/:itemId', auth, (req, res) => {
    const userId = req.user.id;
    const { quantity } = req.body;

    const item = userCarts[userId]?.find(item => item.productId === req.params.itemId);
    if (item) {
        item.quantity = quantity;
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Remove from Cart
router.delete('/:itemId', auth, (req, res) => {
    const userId = req.user.id;
    userCarts[userId] = userCarts[userId].filter(item => item.productId !== req.params.itemId);
    res.json({ message: 'Item removed from cart' });
});

module.exports = router;