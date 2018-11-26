/**
* @Author: fiyc
* @Date : 2018-11-26 17:09
* @FileName : demo7.js
* @Description : 
  - 菜单项
*/

const { BrowserWindow, Menu } = require('electron')



function createWindow () {
  let win = new BrowserWindow({ width: 800, height: 600, center: true })
  win.loadURL("https://www.baidu.com");

  win.on('closed', () => {
    win = null
  })

  win.setMenu(null);
  return win;
}

module.exports = createWindow;