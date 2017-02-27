const createCalculation = require('./calc');
const jsdom = require('jsdom');
const { json2csv, tableToObject, concatByColumn } = require('./table-utils');

jsdom.env({
    url: 'https://www.google.com/finance?fstype=ii&q=' + process.argv[2],
    userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0',
    done: function(err, window) {
        var document = window.document;

        let balanceAnn = tableToObject($('#balannualdiv table'));
        let incomeAnn = tableToObject($('#incannualdiv table'));

        // concat two parts
        let ann = concatByColumn(balanceAnn, incomeAnn);

        let results = {};

        Object.keys(ann).forEach(year => {
            results[year] = createCalculation(ann[year]);
        });

        // process.stdout.write(json2csv(ann));
        process.stdout.write(json2csv(results));

        function $(s) { return document.querySelector(s); }
    }
});
