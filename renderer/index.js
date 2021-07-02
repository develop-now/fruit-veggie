'use strict'

window.popper = require('popper.js')
require('bootstrap')

const { ipcRenderer, ipcMain } = require('electron')

let randomNum = 0;
let hasNumResult = true;


// randomNum for product id
function getRandomNum(min, max) {
    let min_ = Math.ceil(min);
    let max_ = Math.floor(max);
    return Math.floor(Math.random() * (max_ - min_ +1)) + min_ ;
}

// check randomNum has been existed
function hasNum() {
    
    randomNum = getRandomNum(1,200);
    let numArray = []
    
    $(".num").each(function () {
        numArray.push(this.value);
    })
    
    let i = 0;
    while (i <= (numArray.length - 1)) {
        if(randomNum == numArray[i]) {
            hasNumResult = true;
            break;
        }
        hasNumResult = false;
        i++;
    }
}

// change value
function checkboxVal(value){
    if (value === 'false') {
        return 'true';
    }else {
        return 'false';
    }
}

// checked - value: true, unchecked - value: false
$(".big-checkbox").on('click', function () {
    let value = this.value;
    this.value = checkboxVal(value);
});

// put randomNum to input tag (name="submitNum") in form
$("input[name=name]").on('click', function() {
    hasNum();

    // if hasNumResult = true, callback hasNum() until hasNumResult = false
    if(hasNumResult) {

        while(hasNumResult) {
            hasNum();
            
        }
    }
    $("input[name=submitNum]").val(randomNum);

})

// set Non a Number to 0
function setDefaultValue(value){
    let value_ = value

    if(isNaN(value_)){
        value_ = 0
    }
    return value_
}

$("form").on('submit', function (e) {
    e.preventDefault();

    // get and set value to object
    const submitNum = parseInt($('input[name=submitNum]').val())
    const name = $('input[name=name]').val()
    const box = $('input[name=box]').val()
    const box_kg = setDefaultValue(parseInt($('input[name=box_kg]').val()))
    const quantity = parseInt($('input[name=quantity]').val())
    const quantityByOneBox = setDefaultValue(parseInt($('input[name=quantityByOneBox]').val()))
    const packing = $('input[name=packing]').val()
    const unitPrice = parseInt($('input[name=unitPrice]').val())
    const marginRate = parseInt($('input[name=marginRate]').val())
    
    let formData = {
        submitNum : submitNum,
        name : name,
        box : box,
        box_kg : box_kg,
        quantity : quantity,
        quantityByOneBox : quantityByOneBox,
        packing : packing,
        unitPrice : unitPrice,
        marginRate : marginRate,
    }
    
    //send submitted data to main process
    ipcRenderer.send('add-product', formData);
        
    // init form value
    $(".big-checkbox").prop("checked", false);
    $(".big-checkbox").val("false");
    $(".numTextBox").val('');
    $("input[name = name]").val('');
    $("input[name = unit-price]").val('');
    
})

ipcRenderer.on('products', function(event, products) {
    const calculatorTbody = document.getElementById('calculatorT_tbody')
    let html = ''
    if(products.length > 0){

        products.forEach(function(product, index, products) {

            let marginPrice = product.unitPrice*(product.marginRate*0.01)+product.unitPrice
            let byGram = Math.floor(marginPrice/product.box_kg*0.1)
            let byQuantity = Math.floor(marginPrice/product.quantityByOneBox)

            html += `<input type="hidden" class="num" value="${index+1}">`
                    + `<input type="hidden" class="num" value="${product.submitNum}">`
                    + `<tr><td>${index + 1}<input type="hidden" class="num" value="${product.submitNum}"></td>`
                    + `<td><input type="text" class="productInfo" name="name" value="${product.name}"></td>`
                    + `<td><input type="number" class="productInfo" name="quantity" value="${product.quantity}" style="width:35px"></td>`
            
            if(product.box ==='true' && product.box_kg != 0){
                html += `<td><input type="number" class="productInfo" name="box_kg" value="${product.box_kg}" style="width:35px"><span class="lightText">kg<span></td>`
            }else if(product.box ==='true' && product.quantityByOneBox != 0){
                html += `<td><input type="number" class="productInfo" name="quantityByOneBox" value="${product.quantityByOneBox}" style="width:35px"><span class="lightText">개<span></td>`
            }else{
                html += `<td>-</td>`
            }

            html += `<td><input type="number" class="productInfo" name="unitPrice" value="${product.unitPrice}" style="width:53px"</td>`
                    + `<td>${marginPrice}&nbsp;&#47;`
                    + `<input type="number" class="productInfo" name="marginRate" value="${product.marginRate}" style="width:28px"><span class="lightText">%<span>`
                    + `</td>`
            
            if(product.box === 'true' && product.quantityByOneBox != 0){
                html += `<td>${byQuantity}<span class="lightText">원<span></td>`
            }else if(product.box === 'true' && product.box_kg != 0){
                html += `<td>${byGram}<span class="lightText">원<span></td>`
            }else{
                html += `<td>-</td>`
            }
            
            if(product.packing === 'true'){
                html += `<td><input type="checkbox" class="productInfo infoCheckbox" name="packing" value="true" checked></td>`
            }else{
                html += `<td><input type="checkbox" class="productInfo infoCheckbox" name="packing" value="false" ></td>`
            }

            html += `<td><input type="button" class="btn-info btn px-0 savebtn" style="font-size:13px"value="저장"></td>`
                    + `<td class="userCheck">`
                    + `<input type="number" style="width:35px; margin-bottom:1px;">`

            if(product.box_kg != 0){
                    html += `g`
            }else{
                    html += `개`
            }

            html += `<td class="userCheck">`
                    + `<input class="px-0 py-0" type="button" value="-" style="font-size: 12px; width:13px">`
                    + `<input type="number" style="width:55px; margin-bottom:1px;">`
                    + `<input class="px-0 py-0" type="button" value="+" style="font-size: 12px"></td>`
                    
            if(product.box === 'true' && product.box_kg != 0){
                if(product.packing === 'true'){
                    html += `<td class="priceCol">${Math.floor(1000*10/byGram)*10}g</td>`
                    + `<td class="priceCol">${Math.floor(1500*10/byGram)*10}g</td>`
                    + `<td class="priceCol">${Math.floor(2000*10/byGram)*10}g</td>`
                    + `<td class="priceCol">${Math.floor(2500*10/byGram)*10}g</td>`
                    + `<td class="priceCol">${Math.floor(3000*10/byGram)*10}g</td>`
                }else{
                    html += `<td class="priceCol">${Math.floor(900*10/byGram)*10}g</td>`
                    + `<td class="priceCol">${Math.floor(1400*10/byGram)*10}g</td>`
                    + `<td class="priceCol">${Math.floor(1900*10/byGram)*10}g</td>`
                    + `<td class="priceCol">${Math.floor(2400*10/byGram)*10}g</td>`
                    + `<td class="priceCol">${Math.floor(2900*10/byGram)*10}g</td>`
                }
            }else if(product.box === 'true' && product.quantityByOneBox != 0){
                if(product.packing === 'true'){
                    html += `<td class="priceCol">${byQuantity-100}</td>`
                    + `<td class="priceCol">${byQuantity*2-100}</td>`
                    + `<td class="priceCol">${byQuantity*3-100}</td>`
                    + `<td class="priceCol">${byQuantity*4-100}</td>`
                    + `<td class="priceCol">${byQuantity*5-100}</td>`
                }else{
                    html += `<td class="priceCol">${byQuantity}</td>`
                    + `<td class="priceCol">${byQuantity*2}</td>`
                    + `<td class="priceCol">${byQuantity*3}</td>`
                    + `<td class="priceCol">${byQuantity*4}</td>`
                    + `<td class="priceCol">${byQuantity*5}</td>`
                }
            }else {
                html += `<td class="priceCol">${marginPrice}</td>`
                    + `<td class="priceCol">${marginPrice*2}</td>`
                    + `<td class="priceCol">${marginPrice*3}</td>`
                    + `<td class="priceCol">${marginPrice*4}</td>`
                    + `<td class="priceCol">${marginPrice*5}</td>`
            }
                html += `<td><input type="button" class="btn-danger btn px-0 deletebtn" value="삭제"></td></tr>` 
            
            })
        }

    calculatorTbody.innerHTML = html
    
})

// set value when clicked checkbox in table
$('#calculatorT_tbody').on('click','.infoCheckbox', function () {
    let value = this.value
    this.value = checkboxVal(value)
})

$('#calculatorT_tbody').on('click','.savebtn', function () {
    let index = parseInt($(this).parent().parent().prev().prev().val())-1
    let itemNum = parseInt($(this).parent().parent().prev().val())
    let name = $(this).parent().prev().prev().prev().prev().prev().prev().prev().children().val()
    let quantity =  parseInt($(this).parent().prev().prev().prev().prev().prev().prev().children().val())
    let kg_quantity = parseInt($(this).parent().prev().prev().prev().prev().prev().children().val())
    let unitPrice = parseInt($(this).parent().prev().prev().prev().prev().children().val())
    let marginRate = parseInt($(this).parent().prev().prev().prev().children().val())
    let packing = $(this).parent().prev().children().val()

    if(kg_quantity === undefined) {
        kg_quantity = 0;
    }

    let modifyobj = {
        name : name,
        kg_quantity : kg_quantity,
        quantity : quantity,
        packing : packing,
        unitPrice : unitPrice,
        marginRate : marginRate,
    }
    let changeInfo = [index, itemNum, modifyobj];
    ipcRenderer.send('modify-product',changeInfo)
})

// send the submitNum for delete
$('#calculatorT_tbody').on('click', '.deletebtn', function () {
    let index = parseInt($(this).parent().parent().prev().prev().val())-1
    let submitNum = parseInt($(this).parent().parent().prev().val())
    let deleteInfo = [index, submitNum]
    ipcRenderer.send('delete-product', deleteInfo)
})