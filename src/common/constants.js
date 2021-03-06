/**
* @Author: fiyc
* @Date : 2018-11-28 09:46
* @FileName : constants.js
* @Description : 
    常量模块
*/

const constants = {
    events: {
        /**
         * 打开/关闭监听端口事件
         * 渲染线程发送, 主线程监听
         */
        CONNECT: "CONNECT", 

        /**
         * 打开/关闭监听端口事件
         * 主线程发送, 渲染线程监听
         */
        CONNECT_REPLY: "CONNECT_REPLY", 

        /**
         * 切换寄存器事件
         * 渲染线程发送, 主线程监听
         */
        CHANGE_TAB: "CHANGE_TAB", 

        /**
         * 切换寄存器事件
         * 主线程发送, 渲染线程监听
         */
        CHANGE_TAB_REPLY: "CHANGE_TAB_REPLY", 

        /**
         * 切换当前寄存器起始位与长度事件
         * 渲染线程发送, 主线程监听
         */
        CHANGE_RANGE: "CHANGE_RANGE", 

        /**
         * 获取当前寄存器值信息事件
         * 主线程发送, 渲染线程监听
         */
        CURRENT_VALUE_UPDATE: "CURRENT_VALUE_UPDATE", 

        /**
         * 点击某个字段, 弹出设置窗口事件
         * 渲染线程发送, 主线程监听
         */
        OPEN_DIALOG: "OPEN_DIALOG",

        /**
         * 设置弹出框数据推送事件
         * 主线程发送, 渲染线程监听
         */
        DIALOG_DATA: "DIALOG_DATA",

        /**
         * 设置字段变化规则事件
         * 渲染线程发送, 主线程监听
         */
        AUTO_CHANGE_SETTING: "AUTO_CHANGE_SETTING",
    },

    actionCode: {
        START: "START",
        STOP: "STOP"
    },

    modbusType: {
        "1": "Coil",
        "2": "Input",
        "3": "HoldingRegister",
        "4": "InputRegister"
    }

};

module.exports = constants;