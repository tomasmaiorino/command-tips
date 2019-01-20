const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');

module.exports = merge(baseConfig, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: ['css-loader']
                    })
            },
            {
                test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)(\?.*$|$)/,
                loaders: [{
                    loader: 'file-loader',
                    options: {
                        name(file) {
                            return 'hash=sha512&digest=hex&name=[hash].[ext]'
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
            new CleanWebpackPlugin('dist', {}),
            new CopyWebpackPlugin([
                { from: 'assets', to: 'assets/', toType: 'dir', ignore: ['*.html', '.js', '.css'] }
            ], { debug: 'debug' }),
            new ExtractTextPlugin('styles.css')]
});
