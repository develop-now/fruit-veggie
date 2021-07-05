'use strict'

const DataStore = require('./DataStore')

class ConfirmDataStore extends DataStore {
    
    modifyProduct(confirm) {

        let confirmations = this.getProducts()
        let index = confirm.index
        if(confirm.name === confirmations[index].name && confirm.confirmQuantity === 0 && confirm.confirmPrice === 0) {
            return
            }
            
            confirmations[index].confirmQuantity = confirm.confirmQuantity
            confirmations[index].confirmPrice = confirm.confirmPrice
            
            this.products = confirmations

        if(confirm.name !== confirmations[index].name){

            confirmations[index].name = confirm.name
            this.products = confirmations

            return this.sortProducts()
        }
        
        return this.saveProducts()
    }
}

module.exports = ConfirmDataStore