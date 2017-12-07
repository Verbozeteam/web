var path = require("path");
var webpack = require("webpack");

module.exports = {
	context: __dirname,

	entry: {
		dashboard: "./frontend/js/DashboardApp",
		public_website: "./frontend/js/PublicWebsiteApp",
	},

	output: {
		path: path.resolve("./frontend/bundles/"),
		filename: "[name]-[hash].js",
	},

	plugins: [],

	module: {
		loaders: [
			{
				test: /\.js?/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: ["react", "es2015", "stage-2"]
				}
			},
			{
				test: /\.css$/,
				loader: "style-loader"
			},
			{
				test: /\.css$/,
				loader: "css-loader",
				query: {
					modules: true,
					localIdentNames: '[name]__[local]__[hash:base64:5]'
				}
			},
		    {
				test: /\.(jpg|png|svg)$/,
		        loaders: [
		            {
		            	loader: 'file-loader',
		            	options: {
		            		name: '[hash].[ext]',
		            		hash: 'sha512',
		            		digest: 'hex',
		            		publicPath: '../static/bundles/'
		            	}
		        	},
		            {
		            	loader: 'image-webpack-loader',
				        options: {
							gifsicle: {
								interlaced: false,
							},
							optipng: {
								optimizationLevel: 7,
							},
							pngquant: {
								quality: '65-90',
								speed: 4
							},
							mozjpeg: {
								progressive: true,
								quality: 65
							},
							// Specifying webp here will create a WEBP version of your JPG/PNG images
							webp: {
								quality: 75
							}
						}
					}
		        ],
		    }
		]
	},

	resolve: {
		modules: ["node_modules"],
		extensions: ['.js']
	},


}