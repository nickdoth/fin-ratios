/**
 * Convert table object to CSV
 * @param {any} obj
 * @returns {string}
 */
function json2csv(obj) {
    let csvLines = [];

    csvLines.push(`"Ratios of ${process.argv[2].toUpperCase()}",` + Object.keys(obj).join(','));

    let vals = Object.keys(obj).map(k => obj[k]);

    Object.keys(vals[0]).forEach(fieldName => {
        csvLines.push(`"${fieldName}",` + vals.map(v => v[fieldName] || '-').join(','));
    });

    return csvLines.join('\r\n');
}

/**
 * Convert column-first table to object
 * @param {HTMLTableElement} table
 * @returns {any}
 */
function tableToObject(table) {
    let obj = {};
    let years = Array.from(table.querySelectorAll('thead th.rgt')).map(n => n.textContent.trim().match(/(\d\d\d\d)-\d\d-\d\d/)[1]);
    Array.from(table.querySelectorAll('tbody tr')).map(tr => {
        // console.log(tr);
        let fieldName = tr.querySelector('td.lft').textContent.trim();
        
        Array.from(tr.querySelectorAll('td.r')).forEach((td, i) => {
            let numLike = td.textContent.replace(',', '').trim();
            // TODO: We are failing to ensure whether '-' means 0 or lack of data (NaN).
            let number = Number(numLike === '-' ? NaN : numLike);
            let yearName = years[i];
            if (!obj[yearName]) obj[yearName] = {};
            obj[yearName][fieldName] = number;
        });
    });
    
    return obj;
}

/**
 * Merge two tables
 * @param ta
 * @param tb
 * @returns {any}
 */
function concatByColumn(ta, tb) {
    let tnew = {}
    Object.keys(ta).forEach(k => {
        tnew[k] = Object.assign({}, ta[k], tb[k])
    });
    return tnew;
}

/** 
 * Data table transform utilities
 * @module uiils
 */
module.exports = {
    json2csv: json2csv,
    tableToObject: tableToObject,
    concatByColumn: concatByColumn
}