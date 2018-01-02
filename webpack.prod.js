var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var WebpackMerge = require('webpack-merge');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

var common = require('./webpack.common.js');

module.exports = WebpackMerge(common, {
    plugins: [
        new BundleTracker({filename: "./webpack-prod-stats.json"}),
        new UglifyJSPlugin(),
        new CleanWebpackPlugin(['frontend/bundles/*.*']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$/,
            threshold: 10240,
            minRatio: 0.8
        }),
    ],


    module: {
        loaders: [
            {
                test: /\.(jpg|png|svg|woff|woff2|eot|ttf|svg|gif)$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            hash: 'sha512',
                            digest: 'hex',
                            publicPath: '../static/bundles/'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            optipng: {
                                optimizationLevel: 7,
                            },
                            pngquant: {
                                quality: '80-85',
                                speed: 1
                            },
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            gifsicle: {
                                interlaced: true,
                                optimizationLevel: 3
                            },
                        }
                    }
                ],
            }
        ]
    }


});