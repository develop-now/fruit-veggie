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
        console.log('this is saveProducts')
        this.set('products', this.products)
        console.log(`this = ${JSON.stringify(this)}`)
        return this
    }

    // sort products desc.
    sortProducts () {
        console.log('this is sortProducts')
        function custonSort(a, b) {
            if(a.name == b.name){ 
                return 0} 
            return  a.name > b.name ? 1 : -1;
        }

        let beforeSorted = this.products; 
        this.products = beforeSorted.sort(custonSort);
        
        return this.saveProducts()
    }

    addProduct (product) {
        this.products = [ ...this.products, product ]
        return this.sortProducts()
    }

    modifyProduct (product) {
        let beforeProduct = this.getProducts()
        let index = product[0]
        let submitNum = product[1]
        let modifyobj = product[2]
        let beforename = beforeProduct[index].name
        

            console.log(`products: ${JSON.stringify(beforeProduct[index])}  \n`)
            if(beforeProduct[index].submitNum === submitNum){
                beforeProduct[index].name = modifyobj.name
                beforeProduct[index].quantity = modifyobj.quantity
                beforeProduct[index].packing = modifyobj.packing
                beforeProduct[index].unitPrice = modifyobj.unitPrice
                beforeProduct[index].marginRate = modifyobj.marginRate

                if( beforeProduct[index].box === 'true' && beforeProduct[index].box_kg != 0){
                    beforeProduct[index].box_kg = modifyobj.kg_quantity

                }else if(beforeProduct[index].box === 'true' && beforeProduct[index].quantityByOneBox != 0){
                    beforeProduct[index].quantityByOneBox = modifyobj.kg_quantity

                }
            }else{
                console.log('Error: modifyProduct() the submitNum does not match')
            }

            if(beforename != modifyobj.name){
                return this.sortProducts()
            }

        return this.saveProducts()
    }

    deleteProduct(deleteInfo) {
        let index = deleteInfo[0]
        let submitNum = deleteInfo[1]
        let products = this.getProducts()
        
        if(products[index].submitNum === submitNum) {
            
            products.splice(index, 1);
            
        }else{
            console.log(`Error: deleteProduct() the submitNum does not match`)
        }
        
        this.products = products
        return this.saveProducts()
    }
    
}

module.exports = DataStore