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
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    //     options: {
                    //         // you can specify a publicPath here
                    //         // by default it uses publicPath in webpackOptions.output
                    //         publicPath: "../",
                    //         hmr: process.env.NODE_ENV === "development"
                    //     }
                    // },
                    "css-loader",
                    // "postcss-loader"
                ]
            },
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js']
    }
}