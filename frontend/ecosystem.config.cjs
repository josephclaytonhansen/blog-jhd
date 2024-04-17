module.exports = {
    apps: [
      {
        name: 'blog-jhd-frontend',
        port: '3000',
        exec_mode: 'cluster',
        instances: 'max',
        script: './.output/server/index.mjs'
      }
    ]
  }