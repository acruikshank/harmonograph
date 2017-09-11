// Module to control application life.
const fs = require('fs')
const {app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')

// Module to create native browser window.

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, workspace;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width:1440, height:860})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/harmonograph.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  const menu = require('./main_menu').init();
  menu.on('save', () => mainWindow.webContents.send('values'));
  menu.on('debug', () => mainWindow.webContents.openDevTools());
  menu.on('reset', () => mainWindow.webContents.send('reset'));

  ipcMain.on('values', (event, ws) => { save(JSON.parse(ws)) })

  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function save(values) {
  dialog.showSaveDialog({
    title: 'Save harmonograph',
    defaultPath: 'name_harmonograph.js'
  }, readTemplate);

  function readTemplate(filename) {
    fs.readFile('harmonograph_template.js', (err, data) => {
      if (err) throw err;
      writeParams(filename, data)
    });
  }

  function writeParams(filename, template) {
    if (!filename) return;
    if (!filename.match(/_harmonograph\.js$/)) filename += '_harmonograph.js';
    fs.writeFile(filename, 'var values = '+JSON.stringify(values)+';\n'+template, function(err) {
      if (err) throw err;
    });
  }
}
