const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// -------------------------------
// GET ALL PRODUCTS
// -------------------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// -------------------------------
// GET SINGLE PRODUCT
// -------------------------------
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// -------------------------------
// CREATE A NEW PRODUCT
// -------------------------------
router.post("/", async (req, res) => {
  try {
    const { name, description, price, image, category, isSale, discount } = req.body;

    if (!name || !description || !price || !image) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    const product = new Product({
      name,
      description,
      price,
      image,
      category: category || "others",
      isSale: isSale || false,
      discount: discount || 0
    });

    await product.save();
    res.json(product);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// -------------------------------
// SAFE UPDATE PRODUCT
// -------------------------------
router.put("/:id", async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.name !== undefined) updateFields.name = req.body.name;
    if (req.body.description !== undefined) updateFields.description = req.body.description;
    if (req.body.price !== undefined) updateFields.price = req.body.price;
    if (req.body.image !== undefined) updateFields.image = req.body.image;
    if (req.body.category !== undefined) updateFields.category = req.body.category;
    if (req.body.isSale !== undefined) updateFields.isSale = req.body.isSale;
    if (req.body.discount !== undefined) updateFields.discount = req.body.discount;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(updatedProduct);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// -------------------------------
// DELETE A PRODUCT
// -------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product removed" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
