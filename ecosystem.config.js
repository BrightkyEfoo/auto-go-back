module.exports = {
  apps: [
    {
      name: 'AUTOGO',
      script: 'server.js', // ou ton fichier d'entrée principal
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
