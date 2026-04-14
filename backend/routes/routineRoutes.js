const express = require('express');
const router = express.Router();
const RoutineHistory = require('../models/Routine');

// Get all routine history for a user
router.get('/:userId', async (req, res) => {
  try {
    const history = await RoutineHistory.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save or update a day's routine
router.post('/:userId', async (req, res) => {
  try {
    const { date, score, tasks } = req.body;
    const entry = await RoutineHistory.findOneAndUpdate(
      { userId: req.params.userId, date },
      { score, tasks },
      { new: true, upsert: true }
    );
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
