let path = require('path');

module.exports = {
    entry: {
        highlight: './js/highlight.js',
        dashboard: './js/dashboard.js',
        auth: './js/auth.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};