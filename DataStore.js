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
        return this
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
                //console.log ("In submitNum:" + submitNum + "product[arr].submitNum:"+ beforeProduct[index].submitNum)//submit 번호 일치 확인
                console.log(`beforeProduct[index].name : ${beforeProduct[index].name} value ${modifyobj.name}`)
                beforeProduct[index].name = modifyobj.name
                console.log(`beforeProduct[index].name : ${beforeProduct[index].name} typeof value ${typeof beforeProduct[index].name}\n`)
                beforeProduct[index].quantity = modifyobj.quantity
                beforeProduct[index].packing = modifyobj.packing
                beforeProduct[index].unitPrice = modifyobj.unitPrice
                beforeProduct[index].marginRate = modifyobj.marginRate
                console.log(`beforeProduct[index].box_kg : ${beforeProduct[index].box_kg} value ${modifyobj.kg_quantity}`)
                console.log(`beforeProduct[index].quantityByOneBox : ${beforeProduct[index].quantityByOneBox} value ${modifyobj.kg_quantity}`)

                if( beforeProduct[index].box === 'true' && beforeProduct[index].box_kg != 0){
                    beforeProduct[index].box_kg = modifyobj.kg_quantity
                    console.log(`beforeProduct[index].name : ${beforeProduct[index].box_kg} typeof value ${typeof beforeProduct[index].box_kg}\n`)

                }else if(beforeProduct[index].box === 'true' && beforeProduct[index].quantityByOneBox != 0){
                    beforeProduct[index].quantityByOneBox = modifyobj.kg_quantity
                    console.log(`beforeProduct[index].name : ${beforeProduct[index].quantityByOneBox} typeof value ${typeof beforeProduct[index].quantityByOneBox}\n`)

                }
                console.log(`After products: ${JSON.stringify(beforeProduct[index])}  \n`)
            }else{
                console.log('Error: the submitNum does not match')
            }

            if(beforename != modifyobj.name){
                return this.sortProducts()
            }

        return this.saveProducts()
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
    //init product when npm start
    /* deleteProduct () {
        this.products = "";
        return this.saveProducts()
    } */
}

module.exports = DataStore