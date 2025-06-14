module.exports = {
  apps: [
    {
      name: "maravian-presentation",
      script: "./server.js",
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      env: {
        NODE_ENV: "production",
        PORT: 8051,
      },
    },
  ],
};
