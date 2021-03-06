/* global $ */
/* eslint no-undef: "error" */
const { ipcRenderer } = require('electron');

let randomNum = 0;
let hasNumResult = true;
let html = '';
// for product id
function getRandomNum(min, max) {
  const min_ = Math.ceil(min);
  const max_ = Math.floor(max);
  return Math.floor(Math.random() * (max_ - min_ + 1)) + min_;
}

// check randomNum has been existed
function hasNum() {
  randomNum = getRandomNum(1, 200);
  const numArray = [];

  $('.num').each(function () {
    numArray.push(this.value);
  });

  let i = 0;
  while (i <= numArray.length - 1) {
    if (randomNum == numArray[i]) {
      hasNumResult = true;
      break;
    }
    hasNumResult = false;
    i++;
  }
}

function checkboxVal(value) {
  if (value === 'false') {
    return 'true';
  }
  return 'false';
}

$('.big-checkbox').on('click', function () {
  const { value } = this;
  this.value = checkboxVal(value);
});

$('input[name=box]').on('click', function () {
  if (this.value === 'true') {
    $('.boxCheked').css('display', 'block');
    $('.boxBackColor').css('backgroundColor', 'rgb(216 190 190 / 46%)');
  } else {
    $('.boxBackColor').css('backgroundColor', '#faf2f1');
    $('.boxCheked').css('display', 'none');
    $('.boxCheck').css('display', 'none');
    $('.boxCheck').children().val('');
    $('input[name=saleWay]').prop('checked', false);
    $('input[name=boxKg]').prop('required', false);
    $('input[name=quantityByOneBox]').prop('required', false);
  }
});

$('input[name=name]').on('click', () => {
  hasNum();

  if (hasNumResult) {
    while (hasNumResult) {
      hasNum();
    }
  }
  $('input[name=submitNum]').val(randomNum);
});

function setDefaultValue(value) {
  let value_ = value;

  if (Number.isNaN(value_)) {
    value_ = 0;
  }
  return value_;
}

$('input[name=saleWay]').on('click', () => {
  const checkedValue = $('input[name=saleWay]:checked').val();

  if (checkedValue === 'gram') {
    $('.boxQauntity').css('display', 'none');
    $('input[name=quantityByOneBox]').prop('required', false);
    $('.boxGram').css('display', 'block');
    $('input[name=boxKg]').prop('required', true);
  }
  if (checkedValue === 'quantity') {
    $('input[name=boxKg]').prop('required', false);
    $('.boxGram').css('display', 'none');
    $('.boxQauntity').css('display', 'block');
    $('input[name=quantityByOneBox]').prop('required', true);
  }
});

function radioValueCheck() {
  const boxState = $('input[name=box]').val();
  const boxWayCheck = $('input[name=saleWay]').is(':checked');
  let result = 2;
  if (boxState === 'false') {
    result = 1;
  }
  console.log(`boxway${boxWayCheck}`);
  if (boxState === 'true' && !boxWayCheck) {
    alert(
      'g?????? ???????????? ??????: ????????????\n????????? ???????????? ??????: ??????????????? ???????????????\n*??????????????? ????????????: ????????????????????? ???????????????'
    );
    result = 0;
  }
  return result;
}

$('form').on('submit', (e) => {
  e.preventDefault();

  if (radioValueCheck() === 0) {
    return;
  }

  const submitNum = parseInt($('input[name=submitNum]').val());
  const name = $('input[name=name]').val();
  const box = $('input[name=box]').val();
  const boxKg = setDefaultValue(parseInt($('input[name=boxKg]').val()));
  const quantity = parseInt($('input[name=quantity]').val());
  const quantityByOneBox = setDefaultValue(
    parseInt($('input[name=quantityByOneBox]').val())
  );
  const packing = $('input[name=packing]').val();
  const unitPrice = parseInt($('input[name=unitPrice]').val());
  const marginRate = parseInt($('input[name=marginRate]').val());
  const confirmQuantity = 0;
  const confirmPrice = 0;

  const formData = {
    submitNum,
    name,
    box,
    boxKg,
    quantity,
    quantityByOneBox,
    packing,
    unitPrice,
    marginRate,
  };

  const userConfirm = {
    submitNum,
    name,
    confirmQuantity,
    confirmPrice,
  };

  const data = [formData, userConfirm];

  ipcRenderer.send('add-product', data);

  $('.big-checkbox').prop('checked', false);
  $('.big-checkbox').val('false');
  $('.numTextBox').val('');
  $('input[name = name]').val('');
  $('input[name = unit-price]').val('');
  $('.boxCheked').css('display', 'none');
  $('.boxQauntity').css('display', 'none');
  $('input[name=saleWay]').prop('checked', false);
  $('input[name=quantityByOneBox]').prop('required', false);
  $('.boxGram').css('display', 'none');
  $('input[name=boxKg]').prop('required', false);
});

const dateTag = document.getElementById('date');
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const date_ = date.getDate();
html = `${year}??? ${month}??? ${date_}???`;

dateTag.innerHTML = html;

ipcRenderer.on('products', (event, data_) => {
  const products = data_[0];
  const confirmations = data_[1];

  const calculatorTbody = document.getElementById('calculatorT_tbody');
  html = '';
  if (products.length > 0) {
    products.forEach((product, index) => {
      const confirmData = confirmations[index];
      const marginPrice = Math.floor(
        product.unitPrice * (product.marginRate * 0.01) + product.unitPrice
      );
      const byGram = Math.ceil((marginPrice / product.boxKg) * 0.1);
      const byQuantity = Math.ceil(marginPrice / product.quantityByOneBox);

      html +=
        `<input type="hidden" class="num" value="${index + 1}">` +
        `<input type="hidden" class="num" value="${product.submitNum}">` +
        `<tr><td>${index + 1}<input type="hidden" class="num" value="${
          product.submitNum
        }"></td>` +
        `<td><input type="text" class="productInfo productInfoName" name="name" value="${product.name}" style="width:180px"></td>` +
        `<td><input type="number" class="productInfo" name="quantity" value="${product.quantity}" style="width:30px"></td>`;

      if (product.box === 'true' && product.boxKg != 0) {
        html += `<td><input type="number" class="productInfo" name="boxKg" value="${product.boxKg}" style="width:35px"><span class="lightText">kg<span></td>`;
      } else if (product.box === 'true' && product.quantityByOneBox != 0) {
        html += `<td><input type="number" class="productInfo" name="quantityByOneBox" value="${product.quantityByOneBox}" style="width:35px"><span class="lightText">???<span></td>`;
      } else {
        html += '<td>-</td>';
      }

      html +=
        `<td><input type="number" class="productInfo" name="unitPrice" value="${product.unitPrice}" style="width:53px"</td>` +
        `<td class="marginFont">${marginPrice}&nbsp;&#47;` +
        `<input type="number" class="productInfo" name="marginRate" value="${product.marginRate}" style="width:18px"><span class="lightText">%<span>` +
        '</td>';

      if (product.box === 'true' && product.quantityByOneBox != 0) {
        html += `<td>${byQuantity}<span class="lightText">???<span></td>`;
      } else if (product.box === 'true' && product.boxKg != 0) {
        html += `<td>${byGram}<span class="lightText">???<span></td>`;
      } else {
        html += '<td>-</td>';
      }

      if (product.packing === 'true') {
        html +=
          '<td><input type="checkbox" class="productInfo infoCheckbox" name="packing" value="true" checked></td>';
      } else {
        html +=
          '<td><input type="checkbox" class="productInfo infoCheckbox" name="packing" value="false" ></td>';
      }

      html +=
        '<td><input type="button" class="savebtn" style="font-size:13px"value="??????"></td>' +
        '<td class="userCheck">' +
        `<input type="number" value="${confirmData.confirmQuantity}" style="width:35px; margin-bottom:1px;"><span class="lightText">`;

      if (product.boxKg != 0) {
        html += 'g';
      } else {
        html += '???';
      }

      html +=
        '</span></td><td class="userCheck">' +
        '<input class="addRemove" type="button" value="-">' +
        `<input type="number" value="${confirmData.confirmPrice}" style="width:56px; margin-bottom:1px;">` +
        '<input class="addRemove" type="button" value="+">' +
        '</td>';

      if (product.box === 'true' && product.boxKg != 0) {
        if (product.packing === 'true') {
          html +=
            `<td class="priceCol">${
              Math.floor((900 * 10) / byGram) * 10
            }<span class="lightText">g</span></td>` +
            `<td class="priceCol">${
              Math.floor((1400 * 10) / byGram) * 10
            }<span class="lightText">g</span></td>` +
            `<td class="priceCol">${
              Math.floor((1900 * 10) / byGram) * 10
            }<span class="lightText">g</span></td>` +
            `<td class="priceCol">${
              Math.floor((2400 * 10) / byGram) * 10
            }<span class="lightText">g</span></td>` +
            `<td class="priceCol">${
              Math.floor((2900 * 10) / byGram) * 10
            }<span class="lightText">g</span></td>`;
        } else {
          html +=
            `<td class="priceCol">${
              Math.floor((1000 * 10) / byGram) * 10
            }<span class="lightText">g</span></td>` +
            `<td class="priceCol">${
              Math.floor((1500 * 10) / byGram) * 10
            }<span class="lightText">g</span></td>` +
            `<td class="priceCol">${
              Math.floor((2000 * 10) / byGram) * 10
            }<span class="lightText">g</span></td>` +
            `<td class="priceCol">${
              Math.floor((2500 * 10) / byGram) * 10
            }<span class="lightText">g</span></td>` +
            `<td class="priceCol">${
              Math.floor((3000 * 10) / byGram) * 10
            }<span class="lightText">g</span></td>`;
        }
      } else if (product.box === 'true' && product.quantityByOneBox != 0) {
        if (product.packing === 'true') {
          html +=
            `<td class="priceCol">${byQuantity - 100}</td>` +
            `<td class="priceCol">${byQuantity * 2 - 100}</td>` +
            `<td class="priceCol">${byQuantity * 3 - 100}</td>` +
            `<td class="priceCol">${byQuantity * 4 - 100}</td>` +
            `<td class="priceCol">${byQuantity * 5 - 100}</td>`;
        } else {
          html +=
            `<td class="priceCol">${byQuantity}</td>` +
            `<td class="priceCol">${byQuantity * 2}</td>` +
            `<td class="priceCol">${byQuantity * 3}</td>` +
            `<td class="priceCol">${byQuantity * 4}</td>` +
            `<td class="priceCol">${byQuantity * 5}</td>`;
        }
      } else if (product.packing === 'true') {
        html +=
          `<td class="priceCol">${marginPrice - 100}</td>` +
          `<td class="priceCol">${marginPrice * 2 - 100}</td>` +
          `<td class="priceCol">${marginPrice * 3 - 100}</td>` +
          `<td class="priceCol">${marginPrice * 4 - 100}</td>` +
          `<td class="priceCol">${marginPrice * 5 - 100}</td>`;
      } else {
        html +=
          `<td class="priceCol">${marginPrice}</td>` +
          `<td class="priceCol">${marginPrice * 2}</td>` +
          `<td class="priceCol">${marginPrice * 3}</td>` +
          `<td class="priceCol">${marginPrice * 4}</td>` +
          `<td class="priceCol">${marginPrice * 5}</td>`;
      }
      html +=
        '<td><input type="button" class="deletebtn" value="??????"></td></tr>';
    });
  }

  calculatorTbody.innerHTML = html;
});

$('#calculatorT_tbody').on('click', '.infoCheckbox', function () {
  const { value } = this;
  this.value = checkboxVal(value);
});

$('#calculatorT_tbody').on('click', '.savebtn', function () {
  // get product info
  const index = parseInt($(this).parent().parent().prev().prev().val()) - 1;
  const itemNum = parseInt($(this).parent().parent().prev().val());
  const name = $(this)
    .parent()
    .prev()
    .prev()
    .prev()
    .prev()
    .prev()
    .prev()
    .prev()
    .children()
    .val();
  const quantity = parseInt(
    $(this).parent().prev().prev().prev().prev().prev().prev().children().val()
  );
  let kgQuantity = parseInt(
    $(this).parent().prev().prev().prev().prev().prev().children().val()
  );
  const unitPrice = parseInt(
    $(this).parent().prev().prev().prev().prev().children().val()
  );
  const marginRate = parseInt(
    $(this).parent().prev().prev().prev().children().val()
  );
  const packing = $(this).parent().prev().children().val();

  // get confirmation price
  let confirmQuantity = parseInt($(this).parent().next().children().val());
  let confirmPrice = parseInt(
    $(this).parent().next().next().children().next().val()
  );

  if (kgQuantity === undefined) {
    kgQuantity = 0;
  }

  confirmQuantity = setDefaultValue(confirmQuantity);
  confirmPrice = setDefaultValue(confirmPrice);

  const modifyobj = {
    name,
    kgQuantity,
    quantity,
    packing,
    unitPrice,
    marginRate,
  };

  const userConfirmation = {
    index,
    submitNum: itemNum,
    name,
    confirmQuantity,
    confirmPrice,
  };

  const changeInfo = [index, itemNum, modifyobj];
  const data = [changeInfo, userConfirmation];
  ipcRenderer.send('modify-product', data);
});

$('#calculatorT_tbody').on('click', '.deletebtn', function () {
  const index = parseInt($(this).parent().parent().prev().prev().val()) - 1;
  const submitNum = parseInt($(this).parent().parent().prev().val());
  const deleteInfo = [index, submitNum];
  ipcRenderer.send('delete-product', deleteInfo);
});

$('#priceT').on('click', () => {
  ipcRenderer.send('price-window');
});
