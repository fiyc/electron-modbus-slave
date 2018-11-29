/**
* @Author: fiyc
* @Date : 2018-11-29 13:44
* @FileName : timer.js
* @Description : 
    - 轮询任务调度模块
*/
let tasks = {};

let add = function(taskKey, period, fn){
    remove(taskKey);
    period = Number(period);
    fn();
    tasks[taskKey] = setInterval(fn, period);
}

let remove = function(taskKey){
    if(tasks[taskKey]){
        clearInterval(tasks[taskKey]);
        delete tasks[taskKey]; 
    }
}

module.exports = {
    add,
    remove
};