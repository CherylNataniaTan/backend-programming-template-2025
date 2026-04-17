const gachaService = require('./gacha-service');

async function playGacha(req, res) {
  try {
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        success: false,
        message: 'userId and userName are required',
      });
    }

    const result = await gachaService.executeGacha(userId, userName);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'LIMIT_REACHED') {
      return res.status(403).json({
        success: false,
        message:
          'Error: Anda telah mencapai batas maksimal 5 kali gacha hari ini.',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}

async function getHistory(req, res) {
  try {
    const { userId } = req.params;
    const history = await gachaService.getUserHistory(userId);
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}

async function getPrizes(req, res) {
  try {
    const prizes = await gachaService.getPrizeInventory();
    return res.status(200).json({ success: true, data: prizes });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

async function getWinners(req, res) {
  try {
    const winners = await gachaService.getAnonymizedWinners();
    return res.status(200).json({ success: true, data: winners });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

module.exports = {
  playGacha,
  getHistory,
  getPrizes,
  getWinners,
};
