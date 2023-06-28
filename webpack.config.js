const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'junglestory'),
  },

  plugins: [
    new HtmlWebpackPlugin({
        title: 'our project', 
        template: 'src/custom.html' }),
    new MiniCssExtractPlugin({
        filename:"bundle.css"}),
    new CopyPlugin({
        patterns: [{ from: "src/assets", to: "assets" },{ from: "src/fonts", to: "fonts" },]}),
   ],

  devServer: {
    static: path.join(__dirname, "junglestory"),
    compress: true,
    port: 4000,
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ],
  }
};