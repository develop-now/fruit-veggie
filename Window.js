const { BrowserWindow } = require('electron');

const defaultSetting = {
  width: 1250,
  height: 700,
  show: false,
};

class Window extends BrowserWindow {
  constructor({ file, ...windowSettings }) {
    super({ ...defaultSetting, ...windowSettings });
    this.loadFile(file);
    // this.webContents.openDevTools()
    this.once('ready-to-show', () => {
      this.show();
    });
  }
}

module.exports = Window;
