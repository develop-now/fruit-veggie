'use strict'
const path = require('path')
const { app, ipcMain } = require('electron')

const Window = require('./Window')
const DataStore = require('./DataStore')

require('electron-reload')(__dirname)

const productsData = new DataStore({ name: 'Products Main' })

function main () {
    let mainWindow = new Window({
        file: path.join('renderer', 'index.html'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.once('show', () => {
        mainWindow.webContents.send('products', productsData.getProducts())
    })

    // catch the data from renderer process(index.js)
    ipcMain.on('add-product', function (event, product) {

        // add and save data to dataStore 
        const updatedProducts = productsData.addProduct(product).products

        // send to index.html updatedData
        mainWindow.webContents.send('products', updatedProducts )

    })

}

app.on('ready', main)

app.on('window-all-closed', () => {
    app.quit()
})

