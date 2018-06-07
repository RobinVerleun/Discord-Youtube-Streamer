
// Enable all ES6 transpiled syntax
require('babel-register')({
  presets: [ 'es2015' ]
});

// Run the bot script
require('./src/bot');