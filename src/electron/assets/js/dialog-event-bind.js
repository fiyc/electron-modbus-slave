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
let errorMsg = document.getElementById('error-msg');

autoChangeCheckbox.addEventListener('click', () => {
    errorMsg.innerHTML = "";
    if(autoChangeCheckbox.checked){
        autoChangePart.classList.remove('hidden');
    }else{
        autoChangePart.classList.add('hidden');

        autoChangePeriod.value = 1000;
        autoAddValue.value = 1;
        autoRandomMin.value = 0;
        autoRandomMax.value = 0;
        autoAddChange.click();
    }
});

autoAddChange.addEventListener('click', () => {
    autoChangeType.value = 0;
    autoRandomMin.value = 0;
    autoRandomMax.value = 0;
    autoChangeAddTR.classList.remove('hidden');
    autoChangeRandomTR.classList.add('hidden');
    errorMsg.innerHTML = "";
});

autoRandomChange.addEventListener('click', () => {
    autoChangeType.value = 1;
    autoAddValue.value = 1;
    autoChangeAddTR.classList.add('hidden');
    autoChangeRandomTR.classList.remove('hidden');
    errorMsg.innerHTML = "";
});


confirmBtn.addEventListener('click', () => {
    errorMsg.innerHTML = "";
    let value = parseInt(valueInput.value);
    if(Number.isNaN(value) || value < 0){
        errorMsg.innerHTML = `无效的值 ${valueInput.value}`;
        return;
    }

    let period = parseInt(autoChangePeriod.value);
    if(Number.isNaN(period) || period < 500){
        errorMsg.innerHTML = `无效的变化周期 ${autoChangePeriod.value}`;
        return;
    }


    let addStep = parseInt(autoAddValue.value);
    if(Number.isNaN(addStep)){
        errorMsg.innerHTML = `无效的递增值 ${autoAddValue.value}`;
        return;
    }

    let randomMin = parseInt(autoRandomMin.value);
    if(Number.isNaN(randomMin)){
        errorMsg.innerHTML = `无效的随机最小值`;
        return;
    }

    let randomMax = parseInt(autoRandomMax.value);
    if(Number.isNaN(randomMax)){
        errorMsg.innerHTML = `无效的随机最大值`;
        return;
    }

    if(randomMax < randomMin){
        errorMsg.innerHTML = `随机最大值小于最小值`;
        return;
    }

    let postData = {
        index: fieldIndex.value,
        value: value,
        autoChange: autoChangeCheckbox.checked,
        autoChangePeriod: period,
        autoChangeType: autoChangeType.value,
        autoAddValue: addStep,
        autoRandomMin: randomMin,
        autoRandomMax: randomMax
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