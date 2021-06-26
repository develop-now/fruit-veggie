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

// init defaultVal 
$(".defaultVal").on('click', function () {
    if(this.value == 0){
        this.value = '';
    }
})
$(".defaultVal").on('keydown', function () {
    if(this.value == 0){
        this.value = '';
    }
})

// change defaultVal color and value 
$(".defaultVal").on('keyup', function () {
    if(this.value != '') {
        this.style.color = 'black';
    }else if(this.value === '') {
        this.value = 0;
        this.style.color = 'rgb(146, 143, 143)';
    }
})

// modify the submitted data 
$("form").on('submit', function (e) {

    e.preventDefault();
    let formData = $(this).serializeArray();
    let ObjectedData = new Object();

    
    for(const keys in formData) {
        
        let key = formData[keys].name;
        let value = formData[keys].value;
        
        ObjectedData[key] = value;
        
    }
    
    let jsonData = JSON.stringify(ObjectedData);

    // send submitted data to main process
    ipcRenderer.send('add-product', jsonData);
    
    
    // init form value
    $(".big-checkbox").prop("checked", false);
    $(".big-checkbox").val("false");
    $(".numTextBox").val('');
    $("input[name = name]").val('');
    $("input[name = unit-price]").val('');
    
})

ipcRenderer.on('products', function(event, products) {
    const calculatorTbody = document.getElementById('calculatorT_tbody')
    
    const html = `<td>1</td>
    <td><input type="text" value="양파"></td>
    <td><input type="text" value="100" style="width:35px"></td>
    <td><input type="text" value="100" style="width:35px">개</td>
    <td><input type="text" value="32,000" style="width:53px"</td>
    <td>30,000
        <input type="text" value="25" style="width:28px">%
    </td>
    <td>3.000</td>
    <td><input type="checkbox"></td>
    <td class="userCheck">
        <input type="text" style="width:35px; margin-bottom:1px;" value="164">g
        <input type="text" style="width:35px" value="164">g</td>
    <td class="userCheck">
        <input class="px-0 py-0" type="button" value="-" style="font-size: 12px; width:13px">
        <input type="text" style="width:55px; margin-bottom:1px;" value="12,640">
        <input class="px-0 py-0" type="button" value="+" style="font-size: 12px">

        <input class="px-0 py-0" type="button" value="-" style="font-size: 12px; width:13px">
        <input type="text" style="width:55px" value="12,640">
        <input class="px-0 py-0" type="button" value="+" style="font-size: 12px">
    </td>
    <td class="priceCol">2,000</td>
    <td class="priceCol">4,000</td>
    <td class="priceCol">6,000</td>
    <td class="priceCol">8,000</td>
    <td class="priceCol">9,000</td>
    <td><input type="button" class="btn-danger btn px-0" value="삭제"></td>`
    
    calculatorTbody.innerHTML = html
})