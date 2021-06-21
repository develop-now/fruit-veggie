'use strict'
const path = require('path')
const { app } = require('electron')

const Window = require('./Window')

function main () {
    let mainWindow = new Window({
        file: path.join('renderer', 'index.html'),
        webPreferences: {
            NodeIterator: true,
            contextIsolation: false
        }
    })

    mainWindow.once('show')
}

app.on('ready', main)

app.on('window-all-closed', () => {
    app.quit()
})

