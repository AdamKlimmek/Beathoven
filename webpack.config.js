const path = require('path')

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: [/\.js$/],
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['@babel/env']
                    }
               }
            },
            {
                test: /\.css$/,
                use: [
                    'css-loader',
                ]
            },
            {
                test: /\.(mp3|wav)$/,
                use: [
                    'file-loader',
                ]
            },
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js']
    }
}