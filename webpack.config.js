const webpack = require('webpack');
const { resolve } = require('path');
const autoprefixer = require('autoprefixer');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const CSSModuleLoader = {
    loader: 'css-loader',
    options: {
        modules: {
            localIdentName: '[local]__[hash:base64:5]',
        },
        sourceMap: true,
    },
};

const CSSLoader = {
    loader: 'css-loader',
    options: {
        modules: false,
        sourceMap: true,
    },
};

const postCSSLoader = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        sourceMap: true,
        plugins: () => [
            autoprefixer(),
        ],
    },
};

const config = {
    devtool: 'eval-source-map',
    entry: path.join(__dirname, '/src/index.jsx'),
    output: {
        path: resolve('./src/static/build/'),
        filename: '[name].[hash].js',
        publicPath: '../static/build/',
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Log Those Activities',
            filename: '../../templates/data.html',
            template: './src/templates/webpack_template.html',
        }),
        new MomentLocalesPlugin(), // Removes all moment locales except en.
        new CompressionPlugin({
            test: /\.js(\?.*)?$/i,
        }),
        // new BundleAnalyzerPlugin(), // Uncomment to visualize bundles.
    ],
    module: {
        rules: [
            {
                test: /\.jsx?/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['@babel/preset-react', '@babel/preset-env'],
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                exclude: /\.module\.scss$/,
                use: ['style-loader', CSSLoader, postCSSLoader, 'sass-loader'],
            },
            {
                test: /\.module\.scss$/,
                use: ['style-loader', CSSModuleLoader, postCSSLoader, 'sass-loader'],
            },
            {
                test: /\.(jpg|png|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 25000,
                    },
                },
            },
        ],
    },
};

module.exports = config;
