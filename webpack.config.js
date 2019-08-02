/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const INPUT_DIR = path.resolve(__dirname, 'ui')
const OUTPUT_DIR = path.resolve(__dirname, 'build', 'static')

const webpackConfig = {
    mode: 'development',
    context: INPUT_DIR,
    entry: './index.ts',
    output: {
        filename: 'ui.js',
        path: OUTPUT_DIR
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: true
                }
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Foobar 2000 Web UI',
            meta: { viewport: 'width=device-width, initial-scale=1' }
        })
    ]
}

module.exports = webpackConfig
