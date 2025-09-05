const path = require('path');

module.exports = {
  entry: {
    app: './js/app.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/app.ts',
  },
};
