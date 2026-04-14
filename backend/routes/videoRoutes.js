const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

router.route('/')
  .get(async (req, res) => {
    try {
      const videos = await Video.find().sort({ createdAt: -1 });
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const video = new Video(req.body);
      const created = await video.save();
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.delete('/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
