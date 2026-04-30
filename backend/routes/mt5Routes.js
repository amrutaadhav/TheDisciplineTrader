const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');

// @route   POST /api/mt5/sync
// @desc    Receive trade data from MT5 EA Webhook
router.post('/sync', async (req, res) => {
  try {
    const { syncKey, pair, setup, entry, exit, rr, pl, notes, trades } = req.body;

    // Basic security check: Validate sync key exists
    if (!syncKey || !syncKey.startsWith('DT-')) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Secret Sync Key' });
    }

    // Handle Bulk History Sync
    if (trades && Array.isArray(trades)) {
      const formattedTrades = trades.map(t => ({
        pair: t.pair || 'UNKNOWN',
        setup: t.setup || 'MT5 History Sync',
        entry: t.entry || '0.0',
        exit: t.exit || '0.0',
        rr: t.rr || '1:1',
        pl: t.pl || '0',
        notes: t.notes || 'Synced from MT5 Past History',
        rulesViolated: []
      }));
      
      await Trade.insertMany(formattedTrades);
      console.log(`[MT5 WEBHOOK] Bulk synced ${trades.length} historical trades for key: ${syncKey}`);
      return res.json({ success: true, count: trades.length });
    }

    // Handle Single Trade (Real-time)
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
    console.log(`[MT5 WEBHOOK] Real-time trade synced successfully for key: ${syncKey}`);
    
    res.json({ success: true, trade });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
