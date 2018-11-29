/**
* @Author: fiyc
* @Date : 2018-11-29 13:41
* @FileName : auto-change-cache.js
* @Description : 
    - 字段变换规则缓存模块
*/
let timer = require('../../common/timer');
let modbusMemory = require('../../modbus/memory');
let constant = require('../../common/constants');


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


let makeLoopFn = function(tabType, index, param){
    let fn = function(){
        let tabType = Number(tabType);
        let modbusType = constant.modbusType[tabType.toString()];
        let value = 0;
        if(Number(param.autoChangeType) === 0){
            // 累加操作
            modbusMemory.Read[modbusType]();
            

        }else{
            // 随机操作
            let min = Number(param.autoRandomMin);
            let max = Number(param.autoRandomMax);
            value = Math.floor(Math.random() * (max - min + 1)) + min;
        }

        if(value > 65535){
            value -= 65535;
        }

        if(value < 0){
            value += 65535;
        }

        if(tabType === 1 || tabType === 2){
            value = value % 2;
        }

        modbusMemory.Write[modbusType](index, value);
    }
}


module.exports = {
    set,
    get
}