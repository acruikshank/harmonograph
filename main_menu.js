const {app, Menu} = require('electron')
const EventEmitter = require('events');
class MenuEmitter extends EventEmitter {}
const menuEmitter = new MenuEmitter();

exports.init = function init() {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);
  return menuEmitter;
}

function dispatch(menuItem) {
  menuEmitter.emit(menuItem.role, menuItem);
}

const template = [
  {
    label: 'File',
    submenu: [
      {
        role: 'save',
        label: 'Save',
        accelerator: 'Command+s',
        click: dispatch
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'reset',
        label: 'Reset',
        accelerator: 'Command+Shift+R',
        click: dispatch
      }
    ]
  },
  {
    label: 'Developer',
    submenu: [
      {
        role: 'debug',
        label: 'Debug',
        accelerator: 'Command+I',
        click: dispatch
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
};
