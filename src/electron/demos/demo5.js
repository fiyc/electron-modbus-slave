/**
* @Author: fiyc
* @Date : 2018-11-26 17:01
* @FileName : demo5.js
* @Description : 
  - 剪贴板
*/

const { BrowserWindow, clipboard } = require('electron')



function createWindow () {
  let win = new BrowserWindow({ width: 800, height: 600, center: true })
  win.loadURL("https://www.baidu.com");

  win.on('closed', () => {
    win = null
  })

  clipboard.writeText('Example String')
  return win;
}

module.exports = createWindow;