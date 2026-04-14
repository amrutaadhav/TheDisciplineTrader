const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const trades = await Trade.find({ user: req.user._id }).sort({ date: -1 });
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, async (req, res) => {
    try {
      const trade = new Trade({ ...req.body, user: req.user._id });
      const createdTrade = await trade.save();
      res.status(201).json(createdTrade);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .delete(protect, async (req, res) => {
    try {
      const trade = await Trade.findById(req.params.id);
      if (trade && trade.user.toString() === req.user._id.toString()) {
        await trade.remove();
        res.json({ message: 'Trade removed' });
      } else {
        res.status(404).json({ message: 'Trade not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
