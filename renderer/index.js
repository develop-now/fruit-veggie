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