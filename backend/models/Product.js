const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String, // URL or path
  category: { type: String, required: true, default: "others" }, // <-- new
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
