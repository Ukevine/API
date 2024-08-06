const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a Product (Admin only)
router.post('/',  async (req, res) => {
    // if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const product = new Product(req.body);
    try {
        const productExist=await Product.findOne({name:req.body.name});
    if(productExist){
    res.status(200).json({message:'User Already exists'});
}else{
    const newProduct = await product.save();
    res.status(201).json(newProduct);
}
    } catch (error) {
        res.status(400).json({ message: 'Error creating product' });
    }
});

// Read Products
router.get('/',auth, async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Read Single Product
router.get('/:id',auth, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// Update a Product (Admin only)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// Delete a Product (Admin only)
router.delete('/:id',auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
});

module.exports = router;