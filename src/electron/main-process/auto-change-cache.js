/**
* @Author: fiyc
* @Date : 2018-11-29 13:41
* @FileName : auto-change-cache.js
* @Description : 
    - 字段变换规则缓存模块
*/
let timer = require('../../common/timer');

let cache = {};

let makeKey = function (tabType, index) {
    return `${tabType}_${index}`;
}

let set = function (tabType, index, param) {
    let key = makeKey(tabType, index);
    if (!param.autoChange) {
        timer.remove(key);
        cache[key] = null;
        delete cache[key];
    } else {
        cache[key] = param;
        // TODO 启动变化轮询
    }
}

let get = function (tabType, index) {
    let key = makeKey(tabType, index);
    if (!cache[key]) {
        return {
            autoChange: false,
            autoChangePeriod: 1000,
            autoChangeType: 0,
            autoAddValue: 1,
            autoRandomMin: 0,
            autoRandomMax: 0
        };
    }else{
        return JSON.parse(JSON.stringify(cache[key]));
    }
}


module.exports = {
    set,
    get
}