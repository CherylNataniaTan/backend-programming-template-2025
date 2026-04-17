module.exports = (db) =>
  db.model(
    'Prize',
    db.Schema({
      name: String,
      totalQuota: Number,
      remainingQuota: Number,
    })
  );
