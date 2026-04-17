module.exports = (db) =>
  db.model(
    'GachaLog',
    db.Schema({
      userId: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
      },
      prizeId: {
        type: db.Schema.Types.ObjectId,
        ref: 'Prize',
        default: null,
      },
      prizeName: {
        type: String,
      },
      isWin: {
        type: Boolean,
        default: false,
      },
      playedAt: {
        type: Date,
        default: Date.now,
      },
    })
  );
