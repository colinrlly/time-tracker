const webpack = require('webpack');
const resolve = require('path').resolve;
const config = {
    devtool: 'eval-source-map',
    entry: __dirname + '/src/scenes/data/index.jsx',
    output: {
        path: resolve('/build'),
        filename: 'bundle.js',
        publicPath: resolve('/build`')
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules'
            }]
    }
};
module.exports = config;
