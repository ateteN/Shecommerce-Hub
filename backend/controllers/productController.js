const Product = require("../models/product");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category: category || "others"
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a product (SAFE UPDATE)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Build update object only with provided fields
    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.price) updateFields.price = req.body.price;
    if (req.body.image) updateFields.image = req.body.image;
    if (req.body.category) updateFields.category = req.body.category;
    if (req.body.isSale !== undefined) updateFields.isSale = req.body.isSale;
    if (req.body.discount !== undefined) updateFields.discount = req.body.discount;

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
