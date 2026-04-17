const express = require('express');
const gachaController = require('./gacha-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/gacha', route);

  // Play gacha
  route.post('/', gachaController.playGacha);

  // Get gacha history for a user
  route.get('/history/:userId', gachaController.getHistory);

  // Get list of prizes
  route.get('/prizes', gachaController.getPrizes);

  // Get list of winners
  route.get('/prizes/winners', gachaController.getWinners);
};
