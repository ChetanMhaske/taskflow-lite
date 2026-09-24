const app = require('./app');
const config = require('./config/env');
const db = require('./db');

async function startServer() {
  try {
    // Attempt database connection
    await db.initDb();

    const server = app.listen(config.port, () => {
      console.log(`=================================================`);
      console.log(` TaskFlow Lite Backend Server Running `);
      console.log(` Port: ${config.port}`);
      console.log(` Environment: ${config.nodeEnv}`);
      console.log(` Database: ${db.isPostgresActive() ? 'PostgreSQL (Prisma)' : 'Active (Fallback Mode)'}`);
      console.log(` API URL: http://localhost:${config.port}/api/auth`);
      console.log(`=================================================`);
    });

    const shutdown = async () => {
      console.log('\nGracefully shutting down server...');
      server.close(async () => {
        await db.disconnect();
        console.log('Server closed. Database disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Fatal error during server startup:', error);
    process.exit(1);
  }
}

startServer();
