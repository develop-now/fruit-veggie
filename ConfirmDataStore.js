'use strict'

const DataStore = require('./DataStore')

class ConfirmDataStore extends DataStore {
    
    modify(confirm) {
        let confirmations = this.getProducts()
        let index = confirm.index
        if(confirm.name === confirmations[index].name && confirm.confirmQuantity === 0 && confirm.confirmPrice === 0) {
            return this
        }
        
        confirmations[index].confirmQuantity = confirm.confirmQuantity
        confirmations[index].confirmPrice = confirm.confirmPrice
        
        this.products = confirmations
        
        if(confirm.name !== confirmations[index].name){
            
            confirmations[index].name = confirm.name
            this.products = confirmations
            
            return this.sort()
        }
        
        return this.save()
    }
}

module.exports = ConfirmDataStore