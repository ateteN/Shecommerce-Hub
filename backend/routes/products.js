const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // make sure Product.js exists

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // remove .populate('user', 'name email')
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ADD a new product
router.post('/', async (req, res) => {
  const { name, description, price, image, category } = req.body;
  if (!name || !description || !price || !image) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    const product = new Product({
      name,
      description,
      price,
      image,
      category: category || "others"
    });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// EDIT a product
router.put('/:id', async (req, res) => {
  const { name, description, price, image, category } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, category },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ msg: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
