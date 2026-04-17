const { Prize, GachaLog } = require('../../../models');

async function createPrize(name, quantity) {
  return Prize.create({
    name,
    totalQuota: quantity,
    remainingQuota: quantity,
  });
}

async function countUserGachaToday(userId, startOfDay, endOfDay) {
  return GachaLog.countDocuments({
    userId,
    playedAt: { $gte: startOfDay, $lte: endOfDay },
  });
}

async function getAvailablePrizes() {
  return Prize.find({ remainingQuota: { $gt: 0 } });
}

async function claimPrizeAtomic(prizeId) {
  return Prize.findOneAndUpdate(
    { _id: prizeId, remainingQuota: { $gt: 0 } },
    { $inc: { remainingQuota: -1 } },
    { new: true }
  );
}
async function countPrizeWinners(userId) {
  return GachaLog.countDocuments({
    userId,
    isWin: true,
  });
}
async function createGachaLog(userId, isWin, prizeId = null) {
  return GachaLog.create({ userId, isWin, prizeId });
}

async function getUserHistory(userId) {
  return GachaLog.find({ userId })
    .populate('prizeId', 'name')
    .sort({ playedAt: -1 });
}

async function saveGachaResult(userId, isWin, prizeName, userName) {
  return GachaLog.create({ userId, isWin, prizeName, userName });
}

async function getAllPrizes() {
  return Prize.find({}, 'name totalQuota remainingQuota');
}

async function getWinners() {
  return GachaLog.find({ isWin: true })
    .populate('userId', 'fullName')
    .populate('prizeId', 'name');
}

module.exports = {
  createPrize,
  countUserGachaToday,
  getAvailablePrizes,
  claimPrizeAtomic,
  saveGachaResult,
  createGachaLog,
  getUserHistory,
  getAllPrizes,
  getWinners,
  countPrizeWinners,
};
