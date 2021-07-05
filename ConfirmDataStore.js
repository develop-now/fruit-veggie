'use strict'

const DataStore = require('./DataStore')

class ConfirmDataStore extends DataStore {

    updateConfirm (confirm) {
        console.log(JSON.stringify(confirm))

        if(confirm.confirmQuantity === 0 && confirmPrice === 0) {
            return this.addProduct()
        }else if(confirm.confirmQuantity != 0 && confirmPrice != 0) {
            return this.modifyProduct(confirm)
        }
    }

    modifyProduct(confirm) {
        return
    }
}

module.exports = ConfirmDataStore