'use strict'

//window.popper = require('popper.js') 
//require('bootstrap')

const { ipcRenderer } = require("electron")

ipcRenderer.on('confirm-Price', function (event, data) {
    const products = data[0]
    const confirmations = data[1]
    const priceTbody = document.getElementById('priceT_tbody')
    console.log('confirm' + JSON.stringify(confirmations))
    let html = ''
    confirmations.forEach(function (confirmation, index, confirmations) {
        if(index%2 === 0){
            html +=`<tr class="tr_bg"><td>${index+1}</td>`
        }else {
            html +=`<tr><td>${index+1}</td>`
        }
        html +=`<td><span>${confirmation.name}</span></td>`
            +`<td><span>${confirmation.confirmQuantity}</span>&nbsp;`
            if(products[index].box_kg !== 0) {
                html += `g`
            }else {
                html += `개`
            }
        html +=`</td>`
            +`<td><span>${confirmation.confirmPrice}</span>&nbsp;원</td>`
            +`<tr>`
    })
    
    priceTbody.innerHTML = html
})