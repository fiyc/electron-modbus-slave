/**
* @Author: fiyc
* @Date : 2018-11-28 14:46
* @FileName : setting-cache.js
* @Description : 
    - 界面设置缓存模块
*/

let currentTabCode = 1;

let tabRange = {
    "1":{
        code: 1,
        name: "Coil",
        begin: 0,
        length: 10
    },
    "2":{
        code: 2,
        name: "DiscreteInput",
        begin: 0,
        length: 10
    },
    "3":{
        code: 3,
        name: "HoldingRegister",
        begin: 0,
        length: 10
    },
    "4":{
        code: 4,
        name: "InputRegister",
        begin: 0,
        length: 10
    },
};

let switchTab = function(code){
    code = Number(code) || 1;
    currentTabCode = code;
}

let currentTabInfo = function(){
    return tabRange[currentTabCode.toString()];
}

let changeRange = function(range){
    let currentTabInfo = tabRange[currentTabCode.toString()];
    currentTabInfo.begin = range.start;
    currentTabInfo.length = range.length;
}

let currentTabMemoryName = function(){
    if(currentTabCode === 1){
        return "Coil";
    }else if(currentTabCode === 2){
        return "Input";
    }else if(currentTabCode === 3){
        return "HoldingRegister";
    }else if(currentTabCode === 4){
        return "InputRegister";
    }else{
        return "Coil";
    }
}


module.exports = {
    switchTab,
    currentTabInfo,
    changeRange,
    currentTabMemoryName
};