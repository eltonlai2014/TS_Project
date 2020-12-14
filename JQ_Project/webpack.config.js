const path = require('path');
module.exports = {
    entry: {
        index:'./Script/StockQuery.js',
    },    
    output: {
        filename: './build/index.bundle.js',
    },
    externals: {
        jquery: 'jQuery'
    }
};