'use strict'

window.popper = require('popper.js')
require('bootstrap')

const { ipcRenderer } = require('electron')

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

// checked - value: true, unchecked - value: false
$(".big-checkbox").on('click', function () {

    if (this.value === 'false') {
        this.value = 'true';
    }else {
        this.value = 'false';
    }
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
    
    const productItems = products.reduce((html, product) => {
        html +="<tr></tr>"
        /* += `<tr><td><input type="hidden" class="num" value="${parseProduct.submitNum}"></td>`
            +`<td><input type="text" value="${parseProduct.name}"></td>`
            +`<td><input type="text" value="${parseProduct.quantity}" style="width:35px"></td>`
            +`<td><input type="text" value="${parseProduct.quantityByOneBox}" style="width:35px">개</td>`
            +`<td><input type="text" value="${parseProduct.unitPrice}" style="width:53px"</td>`
            +`<td>30,000`
            +`<input type="text" value="${parseProduct.marginRate}" style="width:28px">%`
            +`</td>`
            +`<td>3.000</td>`
            +`<td><input type="checkbox"></td>`
            +`<td class="userCheck">`
            +`<input type="text" style="width:35px; margin-bottom:1px;" value="164">g`
            +`<td class="userCheck">`
            +`<input class="px-0 py-0" type="button" value="-" style="font-size: 12px; width:13px">`
            +`<input type="text" style="width:55px; margin-bottom:1px;" value="12,640">`
            +`<input class="px-0 py-0" type="button" value="+" style="font-size: 12px"></td>`
            +`<td class="priceCol">2,000</td>`
            +`<td class="priceCol">4,000</td>`
            +`<td class="priceCol">6,000</td>`
            +`<td class="priceCol">8,000</td>`
            +`<td class="priceCol">9,000</td>`
            +`<td><input type="button" class="btn-danger btn px-0" value="삭제"></td></tr>`   
  */           
            
        
            return html
    }, '')

    calculatorTbody.innerHTML = productItems
})