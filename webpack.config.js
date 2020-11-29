const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // absolute path construction
        publicPath: 'dist'
    },
    devtool: 'inline-source-map', // tells webpack that there will be generated source maps
    module: {
        rules: [
            {
                // test which is performed on every file in order to find whether this rules applies
                test: /\.ts$/, // reg ex which tells webpack that I want to check all files that end with .ts
                use: 'ts-loader', // loader which webpack should use to handle a file
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        // which file extensions to add to imported files
        extensions: ['.ts', '.js']
    }
}
