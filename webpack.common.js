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
					plugins: [
                        "transform-runtime",
						"react-native-web/babel"
					],
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
        ]
    },

    resolve: {
        modules: ["node_modules"],
        extensions: ['.js']
    },

}
