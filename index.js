const jsdom = require('jsdom');
const program = require('commander');
const createCalculation = require('./calc');
const { json2csv, tableToObject, concatByColumn } = require('./table-utils');

program
    .arguments('<query>')
    .option('-r, --raw', 'Output raw data only, instead of the result')
    .option('-a, --all', 'Output both the result and the raw data')
    .parse(process.argv);

if (!program.args[0]) {
    console.error('Error: No query specified.');
    program.help();
}
else {
    fetchAndCalc();
}

function fetchAndCalc() {
    jsdom.env({
        url: 'https://www.google.com/finance?fstype=ii&q=' + program.args[0],
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

            if (program.raw) {
                process.stdout.write(json2csv(ann));
            }
            else if (program.all) {
                process.stdout.write(json2csv(concatByColumn(ann, results)));
            }
            else {
                process.stdout.write(json2csv(results));
            }

            function $(s) { return document.querySelector(s); }
        }
    });
}
