var path = require("path");
var webpack = require("webpack");
var BundleTracker = require("webpack-bundle-tracker");

module.exports = {
	context: __dirname,

	entry: {
		public_website: "./frontend/js/public_website",
		dashboard: "./frontend/js/dashboard",
	},

	output: {
		path: path.resolve("./frontend/bundles/"),
		filename: "[name]-[hash].js",
	},

	plugins: [
		new BundleTracker({filename: "./webpack-stats.json"}),
	],

	module: {
		loaders: [
			{
				test: /\.js?/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: ["react", "es2015"]
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
			}
		]
	},

	resolve: {
		modules: ["node_modules"],
		extensions: ['.js']
	},
}