module.exports = {
  apps: [
    {
      name: 'vendure_server',
      script: './dist/apps/server/main.js',
      node_args: '-r dotenv/config',
    },
    {
      name: 'vendure_worker',
      script: './dist/apps/worker/main.js',
      node_args: '-r dotenv/config',
    },
  ],
};
