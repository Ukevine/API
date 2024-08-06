const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Order
router.post('/', auth, async (req, res) => {
    const userId = req.user.id;
    const order = new Order({ user: userId, items: req.body.items });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error creating order' });
    }
});

// View Orders
router.get('/', auth, async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
});

// View Single Order
router.get('/:id', auth, async (req, res) => {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order || order.user.toString() !== req.user.id) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
});

module.exports = router;