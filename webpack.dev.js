var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker');
var WebpackMerge = require('webpack-merge');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var common = require('./webpack.common.js');

module.exports = WebpackMerge(common, {
    plugins: [
        new BundleTracker({filename: "./webpack-dev-stats.json"}),
        new CleanWebpackPlugin(['frontend/bundles/*.*'], {watch: false}),
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
                                optimizationLevel: 3,
                            },
                            pngquant: {
                                quality: '90-100',
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