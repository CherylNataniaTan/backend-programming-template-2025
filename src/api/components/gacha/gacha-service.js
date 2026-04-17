const gachaRepository = require('./gacha-repository');

const prizes = [
  { name: 'Emas 10 gram', quota: 1 },
  { name: 'Smartphone X', quota: 5 },
  { name: 'Smartwatch Y', quota: 10 },
  { name: 'Voucher Rp100.000', quota: 100 },
  { name: 'Pulsa Rp50.000', quota: 500 },
];

async function executeGacha(userId, userName) {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );

  const dailyCount = await gachaRepository.countUserGachaToday(
    userId,
    startOfDay,
    endOfDay
  );

  if (dailyCount >= 5) {
    throw new Error('LIMIT_REACHED');
  }

  const randomIndex = Math.floor(Math.random() * (prizes.length + 5));
  const selectedPrize = prizes[randomIndex];

  let wonPrize = null;

  if (selectedPrize) {
    const currentWinners = await gachaRepository.countPrizeWinners(
      selectedPrize.name
    );

    if (currentWinners < selectedPrize.quota) {
      wonPrize = selectedPrize.name;
    }
  }

  // simpan hasil
  const isWin = wonPrize !== null;
  await gachaRepository.saveGachaResult(userId, isWin, wonPrize, userName);

  return {
    message: wonPrize ? 'Menang!' : 'Tidak menang',
    prize: wonPrize,
  };
}

async function getPrizeInventory() {
  const inventory = await Promise.all(
    prizes.map(async (prize) => {
      const wonCount = await gachaRepository.countPrizeWinners(prize.name);

      return {
        prize: prize.name,
        remaining: prize.quota - wonCount,
      };
    })
  );

  return inventory;
}
async function getAnonymizedWinners() {
  const winners = await gachaRepository.getWinners();

  if (!winners) return [];

  return winners.map((w) => {
    // 1. Ambil nama asli dari populate userId.fullName
    // Jika tidak ada, coba ambil dari w.userName (sebagai cadangan)
    const originalName =
      (w.userId && w.userId.fullName) || w.userName || 'Anonymous';

    // 2. Pastikan jadi string dan bersihkan spasi di ujung
    const name = String(originalName).trim();

    return {
      name,
      prize: w.prizeName || 'Hadiah',
      date: w.createdAt,
    };
  });
}

async function getUserHistory(userId) {
  const history = await gachaRepository.getUserHistory(userId);

  if (!history || history.length === 0) {
    throw new Error(`Histori gacha tidak ditemukan untuk user ini`);
  }

  return history;
}

module.exports = {
  executeGacha,
  getPrizeInventory,
  getAnonymizedWinners,
  getUserHistory,
};
