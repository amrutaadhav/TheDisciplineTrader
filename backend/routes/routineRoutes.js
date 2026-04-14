const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const routines = await Routine.find({ user: req.user._id }).sort({ date: -1 });
      res.json(routines);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, async (req, res) => {
    try {
      const routine = new Routine({ ...req.body, user: req.user._id });
      const createdRoutine = await routine.save();
      res.status(201).json(createdRoutine);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
