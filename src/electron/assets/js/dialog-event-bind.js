/**
* @Author: fiyc
* @Date : 2018-11-29 00:05
* @FileName : dialog-event-bind.js
* @Description : 
    - 渲染层-弹出框页面事件绑定
*/
const {ipcRenderer, remote} = require('electron');
let constant = require('../../../common/constants');

//页面元素
let fieldIndexShow = document.getElementById('field-index-show');
let fieldIndex = document.getElementById('field-index-input');
let valueInput = document.getElementById('set-value-input');
let confirmBtn = document.getElementById('confirm-btn');
let autoChangeCheckbox = document.getElementById('auto-change-checkbox');
let autoChangePart = document.getElementById('auto-change-part');
let autoAddChange = document.getElementById('auto-change-add');
let autoRandomChange = document.getElementById('auto-change-random');
let autoChangePeriod = document.getElementById('auto-change-period');
let autoChangeType = document.getElementById('auto-change-type');
let autoChangeAddTR = document.getElementById('auto-change-add-part');
let autoChangeRandomTR = document.getElementById('auto-change-random-part');
let autoAddValue = document.getElementById('auto-add-value');
let autoRandomMin = document.getElementById('auto-random-min');
let autoRandomMax = document.getElementById('auto-random-max');

autoChangeCheckbox.addEventListener('click', () => {
    if(autoChangeCheckbox.checked){
        autoChangePart.classList.remove('hidden');
    }else{
        autoChangePart.classList.add('hidden');
    }
});

autoAddChange.addEventListener('click', () => {
    autoChangeType.value = 0;
    autoChangeAddTR.classList.remove('hidden');
    autoChangeRandomTR.classList.add('hidden');
});

autoRandomChange.addEventListener('click', () => {
    autoChangeType.value = 1;
    autoChangeAddTR.classList.add('hidden');
    autoChangeRandomTR.classList.remove('hidden');
});


confirmBtn.addEventListener('click', () => {
    let postData = {
        index: fieldIndex.value,
        value: valueInput.value,
        autoChange: autoChangeCheckbox.checked,
        autoChangePeriod: autoChangePeriod.value,
        autoChangeType: autoChangeType.value,
        autoAddValue: autoAddValue.value,
        autoRandomMin: autoRandomMin.value,
        autoRandomMax: autoRandomMax.value
    };

    ipcRenderer.send(constant.events.AUTO_CHANGE_SETTING, postData);
    remote.getCurrentWindow().close();
});

ipcRenderer.on(constant.events.DIALOG_DATA, (event, arg) => {
    fieldIndexShow.innerHTML = `[${arg.index}]`;
    fieldIndex.value = arg.index;
    valueInput.value = arg.value;

    if(arg.autoChange){
        autoChangeCheckbox.click();
    }

    autoChangePeriod.value = arg.autoChangePeriod;

    if(Number(arg.autoChangeType) === 0){
        autoAddChange.click();
    }else{
        autoRandomChange.click();
    }

    autoAddValue.value = arg.autoAddValue;
    autoRandomMin.value = arg.autoRandomMin
    autoRandomMax.value = arg.autoRandomMax

});