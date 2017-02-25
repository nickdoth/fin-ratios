'use strict';

let knowledge = {
//变量名称    Google Finance 对应名称                      教材上的名称 (备注)
    ca   :  'Total Current Assets',                  // Current Assets
    cl   :  'Total Current Liabilities',             // Current Liabilities
    tiv  :  'Total Inventory',                       // -
    oca  :  'Other Current Assets, Total',           // -
    iv   :  d => d.tiv + d.oca,                      // Inventories (由上述两项相加得到.Why?)
    sale :  'Revenue',                               // Sales (存疑)
    ar   :  'Accounts Receivable - Trade, Net',      // Accounts Receivable
    ds   :  d => d.sale / 365,                       // Daily Sales (存疑)
    cg   :  'Cost of Revenue, Total',                // Cost of goods sold
    oi   :  'Operating Income',                      // Operating Income or EBIT
    ta   :  'Total Assets',                          // Total Assets
    te   :  'Total Equity',                          // Total Equity
    ni   :  'Net Income',                            // Net Income
    inter: 'Selling/General/Admin. Expenses, Total'  // Interests (严重存疑)
};

function calculate(d) {
    let r = {};
    
    // ### Liquidity Ratios ###
    // 当前流动性比率
    r.currentLiquidityRatio = d.ca / d.cl;
    // 速动比率
    r.qucikRatio = (d.ca - d.iv) / d.cl;
    // 应收款比率
    r.accountRecievableTurnover = d.sale / d.ar;
    r.averageCollectionPeriod = d.ar / d.ds; // 周期
    // 库存成交量
    r.inventoryTurnover = d.cg / d.iv; // in units
    r.inventoryTurnoverAlt = d.sale / d.iv; // in dollars
    
    // ### Profitability Ratios ###
    // 利润幅度
    r.profitMargin = d.oi / d.sale;
    // 毛利幅度
    r.grossProfitMargin = (d.sale - d.cg) / d.sale;
    // Asset Turnover (External)
    r.assetTurnover = d.sale / d.ta;
    // ROI 投资回报率
    r.roi = r.assetTurnover * r.profitMargin;
    // ROE 净资产收益率
    r.roe = d.ni / d.te;
    // Earning Power 获利能力
    r.earningPower = d.ni / d.ta;
    // 利息保障倍数
    r.timesInterestEarned = d.oi / d.inter;
    
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
    r['应收款比率'] = d.sale / d.ar;
    r['应收款比率 (周期)'] = d.ar / d.ds; // 周期
    // 库存成交量
    r['库存成交量 in units'] = d.cg / d.iv; // in units
    r['库存成交量 in dollars'] = d.sale / d.iv; // in dollars
    
    // ### Profitability Ratios ###
    // 利润幅度
    r['利润幅度'] = d.oi / d.sale;
    // 毛利幅度
    r['毛利幅度'] = (d.sale - d.cg) / d.sale;
    // Asset Turnover (External)
    r['Asset Turnover (External)'] = d.sale / d.ta;
    // ROI 投资回报率
    r['ROI 投资回报率'] = r.AssetTurnover * r.利润幅度;
    // ROE 净资产收益率
    r['ROE 净资产收益率'] = d.ni / d.te;
    // Earning Power 获利能力
    r['Earning Power 获利能力'] = d.ni / d.ta;
    // 利息保障倍数
    r['利息保障倍数'] = d.oi / d.inter;
    
    return r;
}

let en = calculate;
function createCalculation(annData, calculate = en) {
    let d = {};
    Object.keys(knowledge).forEach(k => {
        let fieldName = knowledge[k];
        if (typeof knowledge[k] === 'function') {
            d[k] = knowledge[k](d);
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

module.exports = createCalculation;
createCalculation.methods = {
    en: calculate,
    cn: calculateCN
}