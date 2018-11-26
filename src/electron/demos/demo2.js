/**
* @Author: fiyc
* @Date : 2018-11-26 16:35
* @FileName : demo2.js
* @Description : 
  - BrowserView
*/

const { BrowserWindow, BrowserView } = require('electron')



function createWindow () {
  let win = new BrowserWindow({ width: 800, height: 600 })

  win.loadFile('src/electron/views/index.html')

  win.on('closed', () => {
    win = null
  })

  let view = new BrowserView({
    webPreferences: {
      nodeIntegration: false
    }
  })
  win.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 800, height: 600 })
  view.webContents.loadURL('https://www.baidu.com')

  let a = BrowserView.getAllViews();

  return win;
}

module.exports = createWindow;