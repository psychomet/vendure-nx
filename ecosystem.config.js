module.exports = {
  apps: [
    {
      name: 'vendure_server',
      script: './dist/apps/server/main.js',
    },
    {
      name: 'vendure_worker',
      script: './dist/apps/worker/main.js',
    },
  ],
};
