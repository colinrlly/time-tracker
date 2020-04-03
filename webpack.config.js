const webpack = require('webpack');
const resolve = require('path').resolve;
const autoprefixer = require('autoprefixer');
const path = require('path');

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
        path: resolve('./src/static/build'),
        filename: 'bundle.js',
        publicPath: resolve('./build'),
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
    },
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
