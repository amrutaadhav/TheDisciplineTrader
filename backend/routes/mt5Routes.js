const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');

// @route   POST /api/mt5/sync
// @desc    Receive trade data from MT5 EA Webhook
router.post('/sync', async (req, res) => {
  try {
    const { syncKey, pair, setup, entry, exit, rr, pl, notes } = req.body;

    // Basic security check: Validate sync key exists
    if (!syncKey || !syncKey.startsWith('DT-')) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Secret Sync Key' });
    }

    // In a fully developed app, you would look up the user by the syncKey
    // const user = await User.findOne({ mt5SyncKey: syncKey });
    // Since this is a standalone demo, we will just save the trade

    const newTrade = new Trade({
      pair: pair || 'UNKNOWN',
      setup: setup || 'MT5 Auto-Sync',
      entry: entry || '0.0',
      exit: exit || '0.0',
      rr: rr || '1:1',
      pl: pl || '0',
      notes: notes || 'Synced via MT5 EA Webhook',
      rulesViolated: []
    });

    const trade = await newTrade.save();
    console.log(`[MT5 WEBHOOK] Trade synced successfully for key: ${syncKey}`);
    
    res.json({ success: true, trade });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
