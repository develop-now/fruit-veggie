'use strict'

const Store = require('electron-store')

class DataStore extends Store {
    constructor (settings) {
        super(settings)
        this.products = this.get('products') || []
    }

    saveProducts () {
        this.set('products', this.products)
        return this
    }

    addProduct (product) {
        
        this.products = [ ...this.products, product ]
        console.log("this is DataStore with all products" + this.products)
        return this.saveProducts()  
    
    }
}

module.exports = DataStore