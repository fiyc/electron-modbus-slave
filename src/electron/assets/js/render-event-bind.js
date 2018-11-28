/**
* @Author: fiyc
* @Date : 2018-11-28 10:47
* @FileName : render-event-bind.js
* @Description : 
    - 渲染线程事件绑定
*/

const {ipcRenderer} = require('electron');
let constant = require('../../../common/constants');
let connBtn = document.getElementById('conn-btn');
let portDom = document.getElementById('port');
let navTabs = document.querySelectorAll('.nav-tab');
let contentTypeDom = document.getElementById('content-type-name');
let contentStart = document.getElementById('content-start');
let contentLength = document.getElementById('content-length');
let changeRangeBtn = document.getElementById('change-range-btn');
let contentBody = document.getElementById('content-body');

// 连接按钮事件绑定
connBtn.addEventListener('click', () => {
    let actionCode = connBtn.actionCode || constant.actionCode.START;
    let port = portDom.value;

    ipcRenderer.send(constant.events.CONNECT, {
        actionCode: actionCode,
        port: port
    });
});

ipcRenderer.on(constant.events.CONNECT_REPLY, (event, arg) => {
    alert(arg.message);
    if(arg.success){
        reverseBtnStatus();
    }    
});

/**
 * 变化连接按钮
 */
let reverseBtnStatus = function(){
    let oldActionCode = connBtn.actionCode || constant.actionCode.START;
    if(oldActionCode === constant.actionCode.START){
        connBtn.classList.remove('btn-success');
        connBtn.classList.add('btn-warning');
        connBtn.innerHTML = constant.actionCode.STOP; 
        connBtn.actionCode = constant.actionCode.STOP;
    }else{
        connBtn.classList.remove('btn-warning');
        connBtn.classList.add('btn-success');
        connBtn.innerHTML = constant.actionCode.START;
        connBtn.actionCode = constant.actionCode.START;
    }
}


// Tab选择事件绑定
navTabs.forEach((item) => {
    item.addEventListener('click', () => {
        navTabs.forEach(each => {
            each.classList.remove('tab-select');
        });

        item.classList.add('tab-select');
        let tabCode = item.getAttribute('data');
        ipcRenderer.send(constant.events.CHANGE_TAB, tabCode);
    });
});

ipcRenderer.on(constant.events.CHANGE_TAB_REPLY, (event, arg) => {
    contentTypeDom.innerHTML = arg.name;
    contentStart.value = arg.begin;
    contentLength.value = arg.length;
});

// 修改数据区间事件绑定
changeRangeBtn.addEventListener('click', () => {
    let start = Number(contentStart.value);
    if(Number.isNaN(start) || start < 0){
        alert(`无效的启始位置: ${contentStart.value}`);
        return;
    }
    let length = Number(contentLength.value);
    if(Number.isNaN(length) || length <= 0){
        alert(`无效的数据长度: ${contentLength.value}`);
        return;
    }

    ipcRenderer.send(constant.events.CHANGE_RANGE, {
        start,
        length
    });
});


// 获取当前值轮询
let requestCurrentValue = function(){
    ipcRenderer.send(constant.events.CURRENT_VALUE_REQUEST);
}

ipcRenderer.on(constant.events.CURRENT_VALUE_REPLY, (event, arg) => {
    // alert(arg);
    let blockNum = Math.ceil(arg.list.length / 8);
    let contentBodyStr = "";
    for(let i=0; i<blockNum; i++){
        let liStr = "";
        for(let j=0; j<8; j++){
            let itemIndex =  i * 8 + j;
            let itemValue = 0;
            if(itemIndex < arg.list.length){
                itemValue = arg.list[itemIndex];
            }

            liStr += `<li class="input-group"><span class="input-group-addon w50">${itemIndex + arg.beginIndex}</span><input type="text" class="form-control w80" index=${itemIndex + arg.beginIndex} value=${itemValue}></li>`;
        }

        let ulStr = `<ul>${liStr}</ul>`;
        contentBodyStr += ulStr;
    }

    contentBody.innerHTML = contentBodyStr;
});

setInterval(requestCurrentValue, 1000);