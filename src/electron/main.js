const { app, BrowserWindow } = require('electron')

let run = require('./demos/demo8');



let win;
app.on('ready', () => {
  win = run();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    win = run();
  }
})
