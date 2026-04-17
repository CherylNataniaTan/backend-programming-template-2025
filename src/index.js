const { env, port } = require('./core/config');
const logger = require('./core/logger')('app');
const app = require('./core/server');

const server = app.listen(port, (err) => {
  if (err) {
    logger.fatal(err, 'Failed to start the server.');
    process.exit(1);
  } else {
    logger.info(`Server runs at port ${port} in ${env} environment`);
  }
});

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'Uncaught exception.');
  // Tutup server dulu, baru exit di dalam callback-nya
  server.close(() => {
    process.exit(1);
  });

  // Force exit jika dalam 1 detik server tidak mau tutup
  setTimeout(() => {
    process.abort();
  }, 1000).unref();
});
