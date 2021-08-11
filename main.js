const path = require('path');
const { app, ipcMain } = require('electron');

const Window = require('./Window');
const DataStore = require('./DataStore');
const ConfirmDataStore = require('./ConfirmDataStore');

// reload window when main.js changed
/* require('electron-reload')(__dirname,{

    electron: require(`${__dirname}/node_modules/electron`)

}) */

const productsData = new DataStore({ name: 'Products Main' });
const confirmData = new ConfirmDataStore({
  name: 'Confirmation Products Price',
});

let priceWindow;

function main() {
  const mainWindow = new Window({
    file: path.join('renderer', 'index.html'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  function submitNumMatchCheck() {
    const products = productsData.getProducts();
    const confirmations = confirmData.getProducts();
    let matching = true;
    let arr = 0;

    if (products.length === confirmations.length) {
      while (arr < products.length) {
        if (products[arr].submitNum !== confirmations[arr].submitNum) {
          matching = false;
          console.log('submitNum does not match');
          break;
        }
        arr += 1;
      }
    }
    return matching;
  }

  mainWindow.once('show', () => {
    const data = [productsData.getProducts(), confirmData.getProducts()];
    mainWindow.webContents.send('products', data);
  });

  ipcMain.on('add-product', (event, data) => {
    const product = data[0];
    const confirm = data[1];

    const updatedProducts = productsData.add(product).products;
    const updatedConfrimation = confirmData.add(confirm).products;

    const data_ = [updatedProducts, updatedConfrimation];

    mainWindow.webContents.send('products', data_);
  });

  ipcMain.on('modify-product', (event, data) => {
    const product = data[0];
    const userConfirmation = data[1];
    if (submitNumMatchCheck()) {
      const modifiedProducts = productsData.modify(product).products;
      const modifiedConfirmation =
        confirmData.modify(userConfirmation).products;
      const data_ = [modifiedProducts, modifiedConfirmation];

      mainWindow.webContents.send('products', data_);
    }
  });

  ipcMain.on('delete-product', (event, deleteInfo) => {
    const updatedProducts = productsData.delete(deleteInfo).products;
    const updatedConfrimation = confirmData.delete(deleteInfo).products;
    const data_ = [updatedProducts, updatedConfrimation];

    mainWindow.webContents.send('products', data_);
  });

  ipcMain.on('price-window', () => {
    if (!priceWindow) {
      priceWindow = new Window({
        file: path.join('renderer', 'price-table.html'),
        width: 660,
        height: 690,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
        parent: mainWindow,
      });

      priceWindow.on('closed', () => {
        priceWindow = null;
      });

      priceWindow.once('show', () => {
        const data = [productsData.getProducts(), confirmData.getProducts()];
        priceWindow.webContents.send('confirm-Price', data);
      });
    }
  });
}

app.on('ready', main);

app.on('window-all-closed', () => {
  app.quit();
});
