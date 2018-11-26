/**
* @Author: fiyc
* @Date : 2018-11-26 16:45
* @FileName : demo3.js
* @Description : 
  - 无边框窗口
*/

const { BrowserWindow } = require('electron')



function createWindow () {
  let win = new BrowserWindow({ width: 800, height: 600 , frame: false})

  win.loadURL("https://www.baidu.com");

  win.on('closed', () => {
    win = null
  })

  return win;
}

module.exports = createWindow;