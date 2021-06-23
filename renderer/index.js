'use strict'

window.popper = require('popper.js')
require('bootstrap')



//click - value:true unclick -value: false
$(".big-checkbox").on('click',function(){
    let id = this.id;
    let value = this.value;

    if (this.value === 'false') {
        this.value = 'true';
    }else {
        this.value = 'false';
    }
});

//submit 하면 checkbox의 value를 false로, checked를 unchecked로 변경해줘야한다.

//form 이 submit 되었었을 때 해당 form의 name 또는 id와 함께 value를 가져온다

//가져온 value를 [{key,value}]로 담는다.
//담긴 배열을 ipcRenderer을 통해 'add-item'으로 main.js에 보낸다.
