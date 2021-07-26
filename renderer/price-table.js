'use strict'

const { ipcRenderer } = require("electron")

ipcRenderer.on('confirm-Price', function (event, data) {
    const products = data[0]
    const confirmations = data[1]
    const priceTbody = document.getElementById('priceT_tbody')
    let html = ''
    
    confirmations.forEach(function (confirmation, index, confirmations) {
        let comfirmPrice = confirmation.confirmPrice.toString()
        
        if( comfirmPrice.length > 3 ) {
            const confirmPriceReverse = comfirmPrice.split('').reverse()
            confirmPriceReverse.splice(3,0,',')
            const confirmPriceComma = confirmPriceReverse.reverse().join('')
            comfirmPrice = confirmPriceComma
        }

        if(index%2 === 0){
            html +=`<tr class="tr_bg"><td>${index+1}</td>`
        }else {
            html +=`<tr><td>${index+1}</td>`
        }
        html +=`<td><span>${confirmation.name}</span></td>`
            +`<td><span>${confirmation.confirmQuantity}</span>&nbsp;<span class="lightText">`
            if(products[index].box_kg !== 0) {
                html += `g`
            }else {
                html += `개`
            }
        html +=`</span></td>`
            +`<td><span>${comfirmPrice}</span>&nbsp;<span class="lightText">원</span></td>`
            +`<tr>`
    })
    
    priceTbody.innerHTML = html
})