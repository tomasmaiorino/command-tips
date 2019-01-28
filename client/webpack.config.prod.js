const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');

module.exports = merge(baseConfig, {
    mode: 'production',
    output: {
        path: path.join(__dirname, './../server/dist'),
        filename: '[name].js',
        publicPath: '/'
    },
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
            //      new CleanWebpackPlugin('../server/dist', {}),
            new CleanWebpackPlugin(['server/dist'], { root: path.resolve(__dirname , '..'), verbose: true }),

            // new CleanWebpackPlugin('dist', {
            //     root: process.cwd(),
            //     verbose: true,
            //     dry: false
            // }),
            new CopyWebpackPlugin([
                { from: 'assets', to: 'assets/', toType: 'dir', ignore: ['*.html', '.js', '.css', 'font', 'webfonts'] }
            ], { debug: 'debug' }),
            new ExtractTextPlugin('styles.css')]
});
