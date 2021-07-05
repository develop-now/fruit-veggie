'use strict'
const path = require('path')
const { app, ipcMain } = require('electron')

const Window = require('./Window')
const DataStore = require('./DataStore')
const ConfirmDataStore = require('./ConfirmDatastore')

require('electron-reload')(__dirname,{
    
    electron: require(`${__dirname}/node_modules/electron`)

})

const productsData = new DataStore({ name: 'Products Main' })
const confirmData = new ConfirmDataStore({ name: 'Confirmation Products Price' })

let priceWindow

function main () {
    let mainWindow = new Window({
        file: path.join('renderer', 'index.html'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.once('show', () => {
        const data = [productsData.getProducts(),confirmData.getProducts()]
        mainWindow.webContents.send('products', data)
    })

    // catch the data from renderer process(index.js)
    ipcMain.on('add-product', function (event, data) {
        const product = data[0]
        const confirm = data[1]

        // add and save data to dataStore 
        const updatedProducts = productsData.addProduct(product).products
        // add and save data to ConfirmDataStore 
        const updatedConfrimation = confirmData.addProduct(confirm).products

        const data_ = [updatedProducts, updatedConfrimation]
        
        // send to index.html updatedData
        mainWindow.webContents.send('products', data_)

    })
    
    // catch the modfied data from renderer process(index.js)
    ipcMain.on('modify-product', function (event, product) {
        
        // modify and save data to dataStore
        const modifiedProducts = productsData.modifyProduct(product).products

        // send to index.html modifiedData
        mainWindow.webContents.send('products', modifiedProducts)
    })

    ipcMain.on('delete-product', function (event, deleteInfo) {
    
        const updatedProducts = productsData.deleteProduct(deleteInfo).products
        const updatedConfrimation = confirmData.deleteProduct(deleteInfo).products
        const data_ = [updatedProducts, updatedConfrimation]
        
        mainWindow.webContents.send('products', data_)
    })

    ipcMain.on('price-window', function () {

        if (!priceWindow) {
            priceWindow = new Window({

                file: path.join('renderer', 'price.html'),
                width: 500,
                height: 600,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                },
                parent: mainWindow,
            })

            priceWindow.on('closed', function () {
                priceWindow = null
            })

        }
    })

}

app.on('ready', main)

app.on('window-all-closed', () => {
    app.quit()
})

