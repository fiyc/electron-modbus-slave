/**
* @Author: fiyc
* @Date : 2018-11-29 00:05
* @FileName : dialog-event-bind.js
* @Description : 
    - 渲染层-弹出框页面事件绑定
*/
const {ipcRenderer} = require('electron');
let constant = require('../../../common/constants');


ipcRenderer.on(constant.events.DIALOG_DATA, (event, arg) => {
    document.getElementById('testspan').innerHTML = arg.value;
});