module.exports = {
  apps: [
    {
      name: 'vendure_server',
      script: './dist/apps/server/main.js',
      node_args: '-r dotenv/config',
      instances: 4,
      autorestart: true,
      watch: false,
      max_memory_restart: '3G',
    },
    {
      name: 'vendure_worker',
      script: './dist/apps/worker/main.js',
      node_args: '-r dotenv/config',
    },
  ],
};
