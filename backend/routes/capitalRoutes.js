const express = require('express');
const router = express.Router();
const Capital = require('../models/Capital');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      let cap = await Capital.findOne({ user: req.user._id });
      if (!cap) {
        cap = await Capital.create({ user: req.user._id, startingAmount: 10000, currentBalance: 10000 });
      }
      res.json(cap);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put(protect, async (req, res) => {
    try {
      const cap = await Capital.findOneAndUpdate({ user: req.user._id }, req.body, { new: true });
      res.json(cap);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
