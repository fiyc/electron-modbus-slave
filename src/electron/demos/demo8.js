/**
* @Author: fiyc
* @Date : 2018-11-26 17:12
* @FileName : demo8.js
* @Description : 
  - shell
*/

const { BrowserWindow, shell } = require('electron')



function createWindow () {
  let win = new BrowserWindow({ width: 800, height: 600, center: true })
  win.loadURL("https://www.baidu.com");

  win.on('closed', () => {
    win = null
  })

  shell.openExternal('https://github.com')
  return win;
}

module.exports = createWindow;