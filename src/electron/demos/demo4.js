/**
* @Author: fiyc
* @Date : 2018-11-26 16:51
* @FileName : demo4.js
* @Description : 
  - 父子窗口
*/

const { BrowserWindow } = require('electron')



function createWindow () {
  let win = new BrowserWindow({ width: 800, height: 600, center: true })
  win.loadURL("https://www.baidu.com");

  win.on('closed', () => {
    win = null
  })

  let child = new BrowserWindow({width: 400, height: 300, parent: win, modal: true, show: false});
  child.once('ready-to-show', () => {
    child.show()
  })
  return win;
}

module.exports = createWindow;