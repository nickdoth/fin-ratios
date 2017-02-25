const createCalculation = require('./calc');
const jsdom = require('jsdom');
// nasdaq:aapl
jsdom.env({
    url: 'https://www.google.com/finance?fstype=ii&q=' + process.argv[2],
    userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0',
    done: function(err, window) {
        var document = window.document;

        function tableToObject(table) {
            let obj = {};
            let years = Array.from(table.querySelectorAll('thead th.rgt')).map(n => n.textContent.trim().match(/(\d\d\d\d)-\d\d-\d\d/)[1]);
            Array.from(table.querySelectorAll('tbody tr')).map(tr => {
                // console.log(tr);
                let fieldName = tr.querySelector('td.lft').textContent.trim();
                
                Array.from(tr.querySelectorAll('td.r')).forEach((td, i) => {
                    let number = Number(td.textContent.replace(',', ''));
                    let yearName = years[i];
                    if (!obj[yearName]) obj[yearName] = {};
                    obj[yearName][fieldName] = number;
                });
            });
            
            return obj;
        }

        let balanceAnn = tableToObject($('#balannualdiv table'));
        let incomeAnn = tableToObject($('#incannualdiv table'));

        Object.keys(balanceAnn).forEach(year => {
            balanceAnn[year] = Object.assign(balanceAnn[year], incomeAnn[year])
        });

        let ann = balanceAnn;

        let results = {};

        Object.keys(ann).forEach(year => {
            results[year] = createCalculation(ann[year]);
        });

        // process.stdout.write(json2csv(ann));
        process.stdout.write(json2csv(results));

        function $(s) { return document.querySelector(s); }
    }
});

function json2csv(obj) {
    let csvLines = [];

    csvLines.push(`"Ratios of ${process.argv[2].toUpperCase()}",` + Object.keys(obj).join(','));

    let vals = Object.keys(obj).map(k => obj[k]);

    Object.keys(vals[0]).forEach(fieldName => {
        csvLines.push(`"${fieldName}",` + vals.map(v => v[fieldName]).join(','));
    });

    return csvLines.join('\r\n');
}