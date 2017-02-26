'use strict';

let terms = {
//  vars    Google Finance Terms                     Terms in lecture materials
    ca   :  'Total Current Assets',                  // Current Assets
    cl   :  'Total Current Liabilities',             // Current Liabilities
    iv   :  'Total Inventory',                       // Inventories
    oca  :  'Other Current Assets, Total',           // - (OCA)
    sale :  'Revenue',                               // Sales
    ar   :  'Accounts Receivable - Trade, Net',      // Accounts Receivable
    ds   :  d => d.sale / 365,                       // Daily Sales
    cg   :  'Cost of Revenue, Total',                // Cost of goods sold
    oi   :  'Operating Income',                      // Operating Income or EBIT
    ta   :  'Total Assets',                          // Total Assets
    te   :  'Total Equity',                          // Total Equity
    ni   :  'Net Income',                            // Net Income
    // inter: 'Selling/General/Admin. Expenses, Total'  // Interests
};

function calculate(d) {
    let r = {};
    
    // ### Liquidity Ratios ###
    // 当前流动性比率
    r['Current Liquidity Ratio'] = d.ca / d.cl;
    // 速动比率
    r['Quick Ratio'] = (d.ca - d.iv - d.oca) / d.cl;
    // 应收款比率
    r['Account Receivable Turnover'] = d.sale / d.ar;
    r['Average Collection Period'] = d.ar / d.ds; // 周期
    // 库存成交量
    r['Inventory Turnover (in units)'] = d.cg / d.iv; // in units
    r['Inventory Turnover (in dollars)'] = d.sale / d.iv; // in dollars
    
    // ### Profitability Ratios ###
    // 利润幅度
    r['Profit Margin'] = d.oi / d.sale;
    // 毛利幅度
    r['Gross Profit Margin'] = (d.sale - d.cg) / d.sale;
    // Asset Turnover (External)
    r['Asset Turnover'] = d.sale / d.ta;
    // ROI 投资回报率
    r['ROI'] = r['Asset Turnover'] * r['Profit Margin'];
    // ROE 净资产收益率
    r['ROE'] = d.ni / d.te;
    // Earning Power 获利能力
    r['Earning Power'] = d.ni / d.ta;
    // 利息保障倍数
    // r['Times Interest Earned'] = d.oi / d.inter;
    
    return r;
}

function calculateCN(d) {
    let r = {};
    
    // ### Liquidity Ratios ###
    // 当前流动性比率
    r['当前流动性比率'] = d.ca / d.cl;
    // 速动比率
    r['速动比率'] = (d.ca - d.iv) / d.cl;
    // 应收款比率
    r['应收账款周转率'] = d.sale / d.ar;
    r['应收账款周转天数'] = d.ar / d.ds; // 周期
    // 库存成交量
    r['库存成交量 in units'] = d.cg / d.iv; // in units
    r['库存成交量 in dollars'] = d.sale / d.iv; // in dollars
    
    // ### Profitability Ratios ###
    // 利润幅度
    r['利润幅度'] = d.oi / d.sale;
    // 毛利幅度
    r['毛利幅度'] = (d.sale - d.cg) / d.sale;
    // Asset Turnover (External)
    r['资产回报 (外部)'] = d.sale / d.ta;
    // ROI 投资回报率
    r['ROI 投资回报率'] = r['资产回报 (外部)'] * r['利润幅度'];
    // ROE 净资产收益率
    r['ROE 净资产收益率'] = d.ni / d.te;
    // Earning Power 获利能力
    r['Earning Power 获利能力'] = d.ni / d.ta;
    // 利息保障倍数
    // r['利息保障倍数'] = d.oi / d.inter;
    
    return r;
}

let en = calculate;
function createCalculation(annData, calculate = en) {
    let d = {};
    Object.keys(terms).forEach(k => {
        let fieldName = terms[k];
        if (typeof terms[k] === 'function') {
            d[k] = terms[k](d);
            return;
        }
        if (!annData[fieldName])
            console.error(`Warning: "${fieldName}" is undefined or NaN: ${annData[fieldName]}`);
        d[k] = annData[fieldName];
    });
    
    return fix(calculate(d), 2);
}

function fix(obj, f) {
    Object.keys(obj).forEach(k => {
        if (!obj[k]) return;
        obj[k] = Number(obj[k].toFixed(f));
    });

    return obj;
}

module.exports = Object.assign(createCalculation, {
    methods: {
        en: calculate,
        cn: calculateCN
    }
});
