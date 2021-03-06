const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  mode: 'production', //production
  entry: {
  	index: path.resolve(__dirname, './src/js/index.js'),
    detail: path.resolve(__dirname, './src/js/detail.js'),
    collections: path.resolve(__dirname, './src/js/collections.js')
  },
  output: {
  	path: path.resolve(__dirname + '/dist'),
  	filename: 'js/[name].js'
  },
  module: {
  	rules: [
      {
      	test: /\.js$/,
      	loader: 'babel-loader',
      	exclude: path.resolve(__dirname, 'node_modules'),
      	query: {
      		'presets': ['latest']
      	}
      },

      {
      	test: /\.tpl$/,
      	loader: 'ejs-loader'
      },

      {
        test: /\.scss$/,
        use: [
          {
          	loader: miniCssExtractPlugin.loader,
	          options: {
	        	  hmr: process.env.NODE_ENV === 'development'
	          }
	        },
	        // 'style-loader',
	        'css-loader',
	        {
	        	loader: 'postcss-loader',
	        	options: {
	        		plugins: function () {
	        			return [autoprefixer('last 5 versions')]
	        		}
	        	}
	        },
	        'sass-loader'
        ]
      },

      {
      	test: /\.(png|jpg|jpeg|gif|ico)$/i,
      	loader: [
          'url-loader?limit=1024&name=img/[name]-[contenthash:6].[ext]',
          'image-webpack-loader'
      	]
      }
  	]
  },

  plugins: [
    new uglify(),
    new htmlWebpackPlugin({
      minify: {
      	removeComments: true,
      	collapseWhitespace: true
      },
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/public/index.html'),
      title: '我的头条',
      chunksSortMode: 'manual',
      chunks: ['index'],
      excludeChunks: ['node_modules'],
      hash: true // 引入的CSS、scripts后带?hash，避免缓存
    }),
    new htmlWebpackPlugin({
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      filename: 'detail.html',
      template: path.resolve(__dirname, 'src/public/detail.html'),
      title: '新闻详情',
      chunksSortMode: 'manual',
      chunks: ['detail'],
      excludeChunks: ['node_modules'],
      hash: true
    }),
    new htmlWebpackPlugin({
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      filename: 'collections.html',
      template: path.resolve(__dirname, 'src/public/collections.html'),
      title: '我的收藏',
      chunksSortMode: 'manual',
      chunks: ['collections'],
      excludeChunks: ['node_modules'],
      hash: true
    }),

    new miniCssExtractPlugin({
    	filename: 'css/[name].css'
    })
  ],

  devServer: {
  	watchOptions: {
  		ignored: /node_modules/
  	},
    open: true,
  	host: 'localhost',
  	port: 3200
  }
};

module.exports = config;
