import HtmlWebpackPlugin from 'html-webpack-plugin';

const module = {
  mode: process.env.NODE_ENV || 'development',
  
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  devServer: {
    open: true,
  }
};

export default module;