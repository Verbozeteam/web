var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker');
var WebpackMerge = require('webpack-merge');
// var CleanWebpackPlugin = require('clean-webpack-plugin');

var common = require('./webpack.common.js');

module.exports = WebpackMerge(common, {
	plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
		new BundleTracker({filename: "./webpack-dev-stats.json"}),
		// new CleanWebpackPlugin(['frontend/bundles/*.*'], {watch: true}),
 	]



});