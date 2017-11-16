var BundleTracker = require('webpack-bundle-tracker');
var WebpackMerge = require('webpack-merge');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var common = require('./webpack.common.js');

module.exports = WebpackMerge(common, {
	plugins: [
		new BundleTracker({filename: "./webpack-dev-stats.json"}),
		new CleanWebpackPlugin(['frontend/bundles/*.*'], {watch: true}),
 	]
});