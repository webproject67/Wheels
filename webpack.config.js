const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    compress: true,
    // host: '192.168.42.222',
    port: 9000
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...glob.sync('./src/*.html')
      .map(htmlFile => {
        return new HtmlWebpackPlugin({
          filename: path.basename(htmlFile),
          template: htmlFile,
          minify: {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
          }
        });
      }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'src/fonts'),
        to: path.resolve(__dirname, 'public/fonts')
      },
      {
        from: path.resolve(__dirname, 'src/img/webp'),
        to: path.resolve(__dirname, 'public/img/webp')
      },
      {
        from: path.resolve(__dirname, 'src/img/*.{png,jpg}'),
        to: path.resolve(__dirname, 'public/img/[name].[ext]')
      },
      {
        from: path.resolve(__dirname, 'src/favicon/*.{png,svg}'),
        to: path.resolve(__dirname, 'public/favicon/[name].[ext]')
      },
      {
        from: path.resolve(__dirname, 'src/favicon/*.{xml,webmanifest}'),
        to: path.resolve(__dirname, 'public/[name].[ext]')
      },
      {
        from: path.resolve(__dirname, 'src/favicon/favicon.ico'),
        to: path.resolve(__dirname, 'public/[name].[ext]')
      }
    ]),
    new ImageminPlugin({ 
      test: /\.svg$/i 
    }),
    new SpriteLoaderPlugin({ 
      plainSprite: true 
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: 'img/svg/sprite.svg'
        }
      }
    ]
  }
}