/**
* @Author: fiyc
* @Date : 2018-11-28 09:46
* @FileName : constants.js
* @Description : 
    常量模块
*/

const constants = {
    events: {
        CONNECT: "CONNECT", // 打开/关闭监听
        CONNECT_REPLY: "CONNECT_REPLY", // 打开/关闭监听返回
        CHANGE_TAB: "CHANGE_TAB", // 切换寄存器
        CHANGE_TAB_REPLY: "CHANGE_TAB_REPLY", // 切换寄存器
        CHANGE_RANGE: "CHANGE_RANGE", // 切换位置与长度
        CHANGE_RANGE_REPLY: "CHANGE_RANGE_REPLY", // 切换位置与长度返回
        SET_CHANGE_RULE: "SET_CHANGE_RULE", // 修改自动变化规则
        SET_VALUE: "SET_VALUE", // 修改值
        CURRENT_VALUE_REQUEST: "CURRENT_VALUE_REQUEST", // 当前值推送请求
        CURRENT_VALUE_REPLY: "CURRENT_VALUE_REPLY" // 当前值
    },

    actionCode: {
        START: "START",
        STOP: "STOP"
    }

};

module.exports = constants;