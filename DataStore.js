'use strict'

const Store = require('electron-store')

class DataStore extends Store {

    constructor (settings) {
        super(settings)
        this.products = this.get('products') || []
    }

    getProducts () {
        this.products = this.get('products') || []
        return this.products
    }

    saveProducts () {
        this.set('products', this.products)
        return this
    }

    addProduct (product) {
        this.products = [ ...this.products, product ]
        return this.sortProducts()
    }

    // sort products desc.
    sortProducts () {
        function custonSort(a, b) {
            if(a.name == b.name){ 
                return 0} 
            return  a.name > b.name ? 1 : -1;
        }

        let beforeSorted = this.products; 
        this.products = beforeSorted.sort(custonSort);

        return this.saveProducts()
    }
    
}

module.exports = DataStore