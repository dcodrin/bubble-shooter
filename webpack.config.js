module.exports = {
    entry: ['./src/_js/game.js'],
    output: {
        path: './public/js/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './public',
        hot: true,
        progress: true
    },
    devtool: 'source-map'
};