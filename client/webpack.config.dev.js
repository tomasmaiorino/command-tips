const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');

module.exports = merge(baseConfig, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader?url=false']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [{
                    loader: 'file-loader',
                    options: {
                        name(file) {
                            return '[hash].[ext]'
                        }
                    }
                },
                    'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },
    plugins:
        [
            new CopyWebpackPlugin([
                { from: 'node_modules/font-awesome/fonts', to: 'fonts' },
                { from: 'node_modules/font-awesome/css/font-awesome.min.css' },
            ]),
            new ExtractTextPlugin('style.css')],
    devServer: {
        inline: true,
        port: 3000,
        host: "0.0.0.0",
        hot: true,
        historyApiFallback: true,
        open: true,
        proxy: {
            "/api": "http://localhost:8089"
        }
    },
});

