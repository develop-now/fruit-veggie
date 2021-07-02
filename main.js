'use strict'
const path = require('path')
const { app, ipcMain } = require('electron')

const Window = require('./Window')
const DataStore = require('./DataStore')

require('electron-reload')(__dirname,{
    
    electron: require(`${__dirname}/node_modules/electron`)

})

const productsData = new DataStore({ name: 'Products Main' })
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
        mainWindow.webContents.send('products', productsData.getProducts())
    })

    // catch the data from renderer process(index.js)
    ipcMain.on('add-product', function (event, product) {

        // add and save data to dataStore 
        const updatedProducts = productsData.addProduct(product).products

        // send to index.html updatedData
        mainWindow.webContents.send('products', updatedProducts)

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
        
        mainWindow.webContents.send('products', updatedProducts)
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

