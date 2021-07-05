'use strict'

const DataStore = require('./DataStore')

class ConfirmDataStore extends DataStore {
    
    modifyProduct(confirm) {
        let confirmations = this.getProducts()
        let index = confirm.index
        if(confirm.name === confirmations[index].name && confirm.confirmQuantity === 0 && confirm.confirmPrice === 0) {
            return this
        }
        
        confirmations[index].confirmQuantity = confirm.confirmQuantity
        confirmations[index].confirmPrice = confirm.confirmPrice
        
        console.log(' before' + this.products)
        this.products = confirmations
        
        console.log(' after' + this.products)
        if(confirm.name !== confirmations[index].name){
            
            confirmations[index].name = confirm.name
            this.products = confirmations
            
            return this.sortProducts()
        }
        
        return this.saveProducts()
    }
}

module.exports = ConfirmDataStore