const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');

// We are bypassing auth middleware for now to test DB connectivity easily
router.route('/')
  .get(async (req, res) => {
    try {
      const trades = await Trade.find().sort({ date: -1 });
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      // Mocking a default user ObjectId since the schema strictly requires one
      const trade = new Trade({ ...req.body, user: "64a2b1c3e4d5f6a7b8c9d0e1" });
      const createdTrade = await trade.save();
      res.status(201).json(createdTrade);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .put(async (req, res) => {
    try {
      const trade = await Trade.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(trade);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      await Trade.findByIdAndDelete(req.params.id);
      res.json({ message: 'Trade removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
