const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './resources/js/script.js',
  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: 'app.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
  ]
};