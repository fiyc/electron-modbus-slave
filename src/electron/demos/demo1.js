/**
* @Author: fiyc
* @Date : 2018-11-26 16:31
* @FileName : demo1.js
* @Description : 
    - 第一个应用
*/

const { BrowserWindow } = require('electron')



function createWindow () {
  let win = new BrowserWindow({ width: 800, height: 600 })

  win.loadFile('src/electron/views/index.html')

  win.on('closed', () => {
    win = null
  })

  return win;
}

module.exports = createWindow;