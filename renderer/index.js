'use strict'

window.popper = require('popper.js')
require('bootstrap')

let randomNum = 0;
let hasNumResult = true;

// checked - value: true, unchecked -value: false
$(".big-checkbox").on('click', function () {
    let value = this.value;

    if (this.value === 'false') {
        this.value = 'true';
    }else {
        this.value = 'false';
    }
});

// randomNum for product id
function getRandomNum(min, max) {
    let min_ = Math.ceil(min);
    let max_ = Math.floor(max);
    return Math.floor(Math.random() * (max_ - min_ +1)) + min_ ;
}

function hasNum() {

    randomNum = getRandomNum(1,200);
    let numArray = []

    // get all values from class="num"
    $(".num").each(function () {
        numArray.push(this.value);
    })
    
    // check randomNum has been existed
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

// TODO : when submit the form, change checkbox value to false and unchecked for state
$("form").on('submit', function (e) {

    e.preventDefault();
    hasNum();

    // if hasNumResult = true, call hasNum() until hasNumTesult = false
    if(hasNumResult) {

        while(hasNumResult) {
            hasNum();
            
        }
    }  
})
