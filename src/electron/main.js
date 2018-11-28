/**
* @Author: fiyc
* @Date : 2018-11-27 11:36
* @FileName : main.js
* @Description : 
    - 主线程入口
*/
const path = require('path');
const { app, BrowserWindow } = require('electron');

let win = null;

let createWindow = function () {
    let options = {
        width: 1080,
        height: 840,
        minWidth: 680,
        title: "electron modbus slave"
    };

    win = new BrowserWindow(options);
    win.loadURL(path.join('file://', __dirname, 'index.html'));


    let eventBind = require('./main-process/main-event-bind');
    eventBind(win);
    
    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})
