module.exports = {
  env: 'dev', //dev|prod
  
  rootDir: './dist',
  
  libsDest: 'libs.js',
  bundleDest: 'bundle.js',
  cssDest: 'main.css',
  
  src: {
    less: './src/less/main.less',
    html: './src/index.html',
    react: './src/app.jsx'
  },
  
  libs: [],
  polyfills: [
    'node_modules/whatwg-fetch/fetch.js'
  ]
};