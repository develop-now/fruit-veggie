const Store = require('electron-store');

class DataStore extends Store {
  constructor(settings) {
    super(settings);
    this.products = this.get('products') || [];
  }

  getProducts() {
    this.products = this.get('products') || [];
    return this.products;
  }

  save() {
    console.log('this is save');
    this.set('products', this.products);
    return this;
  }

  // sort products desc.
  sort() {
    console.log('this is sort');
    function custonSort(a, b) {
      if (a.name == b.name) {
        return 0;
      }
      return a.name > b.name ? 1 : -1;
    }

    const beforeSorted = this.products;
    this.products = beforeSorted.sort(custonSort);

    return this.save();
  }

  add(product) {
    this.products = [...this.products, product];
    return this.sort();
  }

  modify(product) {
    const beforeProduct = this.getProducts();
    const index = product[0];
    const submitNum = product[1];
    const modifyobj = product[2];
    const beforename = beforeProduct[index].name;

    if (beforeProduct[index].submitNum === submitNum) {
      beforeProduct[index].name = modifyobj.name;
      beforeProduct[index].quantity = modifyobj.quantity;
      beforeProduct[index].packing = modifyobj.packing;
      beforeProduct[index].unitPrice = modifyobj.unitPrice;
      beforeProduct[index].marginRate = modifyobj.marginRate;

      if (
        beforeProduct[index].box === 'true' &&
        beforeProduct[index].box_kg != 0
      ) {
        beforeProduct[index].box_kg = modifyobj.kg_quantity;
      } else if (
        beforeProduct[index].box === 'true' &&
        beforeProduct[index].quantityByOneBox != 0
      ) {
        beforeProduct[index].quantityByOneBox = modifyobj.kg_quantity;
      }
    } else {
      console.log('Error: modify() the submitNum does not match');
    }

    if (beforename != modifyobj.name) {
      return this.sort();
    }

    return this.save();
  }

  delete(deleteInfo) {
    const index = deleteInfo[0];
    const submitNum = deleteInfo[1];
    const products = this.getProducts();

    if (products[index].submitNum === submitNum) {
      products.splice(index, 1);
    } else {
      console.log('Error: delete() the submitNum does not match');
    }

    this.products = products;
    return this.save();
  }
}

module.exports = DataStore;
