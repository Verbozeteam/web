var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var WebpackMerge = require('webpack-merge');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var common = require('./webpack.common.js');

module.exports = WebpackMerge(common, {
	plugins: [
		new BundleTracker({filename: "./webpack-prod-stats.json"}),
		new UglifyJSPlugin(),
		new CleanWebpackPlugin(['frontend/bundles/*.*']),
	    new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		})
	]
});