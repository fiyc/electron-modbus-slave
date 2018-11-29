/**
* @Author: fiyc
* @Date : 2018-11-28 10:47
* @FileName : main-event-bind.js
* @Description : 
    - 主线程事件绑定
*/

const path = require('path');
const constants = require('../../common/constants');
const {
    ipcMain,
    BrowserWindow
} = require('electron');
let modbusCore = require('../../modbus/modbus-core');
let modbusMemory = require('../../modbus/memory');
let setting = require('./setting-cache');
let autoChangeCache = require('./auto-change-cache');

let instance = function (mainWindow) {
    ipcMain.on(constants.events.CONNECT, (event, arg) => {
        let response = {
            success: true,
            message: ""
        };

        if (arg.actionCode === constants.actionCode.STOP) {
            modbusCore.stop();
            response.success = true;
            response.message = "停止监听";
        } else {
            let port = Number(arg.port);
            if (Number.isNaN(port) || port <= 0 || port > 65535) {
                response.success = false;
                response.message = "无效的端口号(1~65535)";
            } else {
                try {
                    modbusCore.start(port);
                    response.success = true;
                    response.message = "启动监听";
                } catch (err) {
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
        sendCurrentTabValue();
    });


    ipcMain.on(constants.events.CHANGE_RANGE, (event, arg) => {
        setting.changeRange(arg);
        sendCurrentTabValue();
    });

    ipcMain.on(constants.events.OPEN_DIALOG, (event, arg) => {
        const modulePath = path.join('file://', __dirname, '..', 'views', 'changeValue.html');
        let dialog = new BrowserWindow({
            width: 300,
            height: 200,
            frame: false,
            x: arg.x - 150,
            y: arg.y - 100,
            resizable: false
        });
        dialog.loadURL(modulePath);
        dialog.on('close', () => {
            dialog = null
        });
        dialog.on('blur', () => {
            dialog.close()
        });
        dialog.webContents.on('did-finish-load', () => {
            let tabCode = setting.currentTabInfo().code;
            let dialogData = autoChangeCache.get(tabCode, arg.index);
            dialogData.index = arg.index;
            dialogData.value = arg.value;
            dialog.webContents.send(constants.events.DIALOG_DATA, dialogData);
        });
        dialog.show();
    });

    ipcMain.on(constants.events.AUTO_CHANGE_SETTING, (event, arg) => {
        let tabCode = setting.currentTabInfo().code;
        autoChangeCache.set(tabCode, arg.index, {
            autoChange: arg.autoChange,
            autoChangePeriod: arg.autoChangePeriod,
            autoChangeType: arg.autoChangeType,
            autoAddValue: arg.autoAddValue,
            autoRandomMin: arg.autoRandomMin,
            autoRandomMax: arg.autoRandomMax
        });

        // TODO 设置值
        let value = Number(arg.value);
        let address = Number(arg.index);
        if(tabCode === 1){
            modbusMemory.Write.SingleCoil(address, value);
        }else if(tabCode === 3){
            modbusMemory.Write.SingleRegister(address, value);
        }
    });

    let sendCurrentTabValue = function(){
        let currentTabInfo = setting.currentTabInfo();
        let currentTabMemoryName = setting.currentTabMemoryName();
        let readBuf = modbusMemory.Read[currentTabMemoryName](currentTabInfo.begin, currentTabInfo.length);

        let response = {
            beginIndex: currentTabInfo.begin,
            tabType: currentTabInfo.code,
            list: []
        };


        if (currentTabInfo.code === 1 || currentTabInfo.code === 2) {
            let binaryTemp = "00000000";
            for (let byteValue of readBuf.values()) {
                let binaryStr = binaryTemp + byteValue.toString(2);
                binaryStr = binaryStr.slice(-8);

                for (let bitValue of binaryStr) {
                    response.list.push(bitValue);
                }
            }
        } else {
            let index = 0;
            while (index < readBuf.length - 1) {
                let value = readBuf.readUInt16BE(index);
                response.list.push(value);
                index += 2;
            }
        }

        mainWindow.webContents.send(constants.events.CURRENT_VALUE_UPDATE, response);
    }

    mainWindow.webContents.on('did-finish-load', () => {
        sendCurrentTabValue();
    });

    setInterval(sendCurrentTabValue, 1000);
}

module.exports = instance;