const express = require('express');
const router = express.Router();
const Streak = require('../models/Streak');

// Get streak by userId
router.get('/:userId', async (req, res) => {
  try {
    let streak = await Streak.findOne({ userId: req.params.userId });
    if (!streak) {
      streak = await Streak.create({ userId: req.params.userId });
    }
    res.json(streak);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update streak for userId
router.put('/:userId', async (req, res) => {
  try {
    const streak = await Streak.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(streak);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
