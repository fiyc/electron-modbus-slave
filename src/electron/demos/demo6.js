/**
* @Author: fiyc
* @Date : 2018-11-26 17:05
* @FileName : demo6.js
* @Description : 
  - 对话框
*/

const { BrowserWindow, dialog } = require('electron')



function createWindow () {
  let win = new BrowserWindow({ width: 800, height: 600, center: true })
  win.loadURL("https://www.baidu.com");

  win.on('closed', () => {
    win = null
  })

  console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}))
  return win;
}

module.exports = createWindow;