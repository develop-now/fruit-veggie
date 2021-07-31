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

    save () {
        console.log('this is save')
        this.set('products', this.products)
        return this
    }

    // sort products desc.
    sort () {
        console.log('this is sort')
        function custonSort(a, b) {
            if(a.name == b.name){ 
                return 0} 
            return  a.name > b.name ? 1 : -1;
        }

        let beforeSorted = this.products; 
        this.products = beforeSorted.sort(custonSort);
        
        return this.save()
    }

    add (product) {
        this.products = [ ...this.products, product ]
        return this.sort()
    }

    modify (product) {
        let beforeProduct = this.getProducts()
        let index = product[0]
        let submitNum = product[1]
        let modifyobj = product[2]
        let beforename = beforeProduct[index].name
        
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
                console.log('Error: modify() the submitNum does not match')
            }

            if(beforename != modifyobj.name){
                return this.sort()
            }

        return this.save()
    }

    delete(deleteInfo) {
        let index = deleteInfo[0]
        let submitNum = deleteInfo[1]
        let products = this.getProducts()
        
        if(products[index].submitNum === submitNum) {
            
            products.splice(index, 1);
            
        }else{
            console.log(`Error: delete() the submitNum does not match`)
        }
        
        this.products = products
        return this.save()
    }
    
    
}

module.exports = DataStore