/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const INPUT_DIR = path.resolve(__dirname, 'ui')
const OUTPUT_DIR = path.resolve(__dirname, 'build', 'static')

const webpackConfig = {
    context: INPUT_DIR,
    entry: {
        main: './index.ts'
    },
    output: {
        filename: 'ui.js',
        path: OUTPUT_DIR
    },
    resolve: {
        extensions: ['.js', '.ts', '.css', '.json', '.html']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name][hash:base64]',
                            sourceMap: true,
                            minimize: true
                        }
                    },
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Foobar 2000 Web UI',
            meta: { viewport: 'width=device-width, initial-scale=1' }
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
            chunkFilename: 'styles.css'
        })
    ]
}

module.exports = webpackConfig
