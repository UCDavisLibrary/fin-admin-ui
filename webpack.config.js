const path = require('path');

module.exports = {
  entry: './public/elements/fin-admin-ui.js',
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  target : 'web',
  node: {
    fs: 'empty',
    net : 'empty',
    tls : 'empty',
    url : true
  },
  module : {
    rules: [
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
            options: {
              attrs: false
            }
          }
        },
        {
          test: /\.(ttl|sparql)$/,
          use: {
            loader: 'raw-loader'
          }
        }
    ]
  }
};