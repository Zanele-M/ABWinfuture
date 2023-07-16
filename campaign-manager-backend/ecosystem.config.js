module.exports = {
  apps: [{
    name: 'abtestcampaign',
    script: 'src/index.ts',
    interpreter: '/usr/local/bin/ts-node', // Replace with your `ts-node` path',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      DB_USER_DEV: 'postgres',
      DB_HOST_DEV: 'localhost',
      DB_NAME_DEV: 'winab_dev',
      DB_PASSWORD_DEV: 'CNSPass7051*',
      DB_PORT_DEV: '5432',
      ROLLBAR_TOKEN_DEV: 'd184d3270f0145a58eec8994e7b4d4cf'
    },
    env_production: {
      NODE_ENV: 'production',
      DB_USER_PROD: 'postgres',
      DB_HOST_PROD: 'localhost',
      DB_NAME_PROD: 'winab_prod',
      DB_PASSWORD_PROD: 'CNSPass7051*',
      DB_PORT_PROD: '5432',
      ROLLBAR_TOKEN_PROD: 'd184d3270f0145a58eec8994e7b4d4cf'
    }
  }],
};
