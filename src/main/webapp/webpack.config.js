let path = require('path');

module.exports = {
    entry: './js/highlight.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    watch: true
};