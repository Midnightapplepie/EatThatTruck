const path = require('path');

module.exports = {
  entry: './client/index.js',
  output: {
    //production bundle output to ./dist
    path: path.resolve(__dirname,'docs'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        // Only run .js and .jsx files through Babel
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        // only run 'client' directory through Babel
        include: path.resolve(__dirname, "client"),
        exclude: path.resolve(__dirname, "node_modules"),
        options: {
          presets: ['react', 'es2015']
        }
      },{
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devServer: {
    //serve index.html in client folder
    contentBase: path.join(__dirname, "client"),
    //enable gzip
    compress: true,
    //bundle.js will be served at '/dev/bundle.js'
    publicPath: '/dev/',
    watchContentBase: true
  }
};
