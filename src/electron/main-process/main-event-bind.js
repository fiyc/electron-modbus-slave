/**
* @Author: fiyc
* @Date : 2018-11-28 10:47
* @FileName : main-event-bind.js
* @Description : 
    - 主线程事件绑定
*/

const constants = require('../../common/constants');
const {ipcMain} = require('electron');
let modbusCore = require('../../modbus/modbus-core');
let modbusMemory = require('../../modbus/memory');
let setting = require('./setting-cache');

ipcMain.on(constants.events.CONNECT, (event, arg) => {
    let response = {
        success: true,
        message: ""
    };

    if(arg.actionCode === constants.actionCode.STOP){
        modbusCore.stop();
        response.success = true;
        response.message = "停止监听";
    }else{
        let port = Number(arg.port);
        if(Number.isNaN(port) || port <= 0 || port > 65535){
            response.success = false;
            response.message = "无效的端口号(1~65535)";
        }else{
            try{
                modbusCore.start(port);
                response.success = true;
                response.message = "启动监听";
            }catch(err){
                response.success = false;
                response.message = `监听端口 ${port} 失败`;
            }
        }
    }

    event.sender.send(constants.events.CONNECT_REPLY, response);
});


ipcMain.on(constants.events.CHANGE_TAB, (event, arg) => {
    setting.switchTab(arg);
    let response = setting.currentTabInfo();
    event.sender.send(constants.events.CHANGE_TAB_REPLY, response);
});


ipcMain.on(constants.events.CHANGE_RANGE, (event, arg) => {
    setting.changeRange(arg);
});

ipcMain.on(constants.events.CURRENT_VALUE_REQUEST, (event, arg) => {
    let currentTabInfo = setting.currentTabInfo();
    let currentTabMemoryName = setting.currentTabMemoryName();
    let readBuf = modbusMemory.Read[currentTabMemoryName](currentTabInfo.begin, currentTabInfo.length);

    let response = {
        beginIndex: currentTabInfo.begin,
        tabType: currentTabInfo.code,
        list: []
    };


    if(currentTabInfo.code === 1 || currentTabInfo.code === 2){
        let binaryTemp = "00000000";
        for(let byteValue of readBuf.values()){
            let binaryStr = binaryTemp + byteValue.toString(2);
            binaryStr = binaryStr.slice(-8);

            for(let bitValue of binaryStr){
                response.list.push(bitValue);
            }
        }
    }else{
        let index = 0;
        while(index < readBuf.length - 1){
            let value = readBuf.readUInt16BE(index);
            response.list.push(value);
            index += 2;
        }
    }

    event.sender.send(constants.events.CURRENT_VALUE_REPLY, response); 
});
