module.exports = {
  apps : [{
    name: 'shorturl',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: true,
    "ignore_watch" : ["node_modules", ".git","data","*.txt", "*.htm","ecosystems.config.js"],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

};
