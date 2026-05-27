const express = require('express');
const router = express.Router();

// Cart is managed client-side in localStorage/context
// This route can be used for cart validation/price checking
router.post('/validate', async (req, res) => {
  const Product = require('../models/Product');
  try {
    const { items } = req.body;
    let total = 0;
    const validated = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const pack = product.packs.find(p => p._id.toString() === item.packId) || product.packs[0];
        validated.push({
          productId: product._id,
          name: product.name,
          packLabel: pack?.label,
          price: pack?.price || product.price,
          quantity: item.quantity,
        });
        total += (pack?.price || product.price) * item.quantity;
      }
    }
    res.json({ items: validated, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
