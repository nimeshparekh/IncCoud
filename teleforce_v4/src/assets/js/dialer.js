// var digit = document.getElementsByClassName('digit');
// var deleteBtn = document.getElementById('delete');
// var clearBtn = document.getElementById('clear');
// var callDisplay = document.getElementById('call');
// var saved = document.getElementsByClassName('saved');

// var updateDisplay = function(){
//   callDisplay.innerHTML = call;
// } 

// //Add event listener to Delete button
// //Clear delete last digit from dialer number
// deleteBtn.addEventListener('click', function(){
//   call = call.substring(0, call.length - 1);
//   updateDisplay();
// });

// //Add event listener to Clear button
// //Clear dialer number
// clearBtn.addEventListener('click', function(){
//   call = "";
//   updateDisplay();
// });

// //Add event listeners to saved contacts
// //Get phone number & insert into dialer
// for(let j=0; j < saved.length; j++){
//   var contact;
  
//   saved[j].addEventListener('click', function(){
//     contact = saved[j];
//     call = contact.getElementsByTagName('H2')[0].innerHTML;
//     updateDisplay();
//   });
// }

// //Add event listeners to 0-1, * & # buttons
// //Update dialer number when each key is pressed
// //Prevent more than 11 numbers being entered
// for(let i = 0; i < digit.length; i++){
//   var number;
//   var call = "";
  
//   digit[i].addEventListener('click', function(){
//     if(call.length === 13){
//       return;
//     }
//     if(i<9){
//       number = (i + 1).toString();
//     }else if(i === 9){
//       number = "*";
//     }else if(i === 10){
//       number = 0;
//     }else{
//       number = "#";
//     }
//     call += number;
//     updateDisplay();
//   }); 
// }

//new dialer js
$(document).ready(function () {

  $('.num').click(function () {
      var num = $(this);
      var text = $.trim(num.find('.txt').clone().children().remove().end().text());
      var telNumber = $('#telNumber');
      $(telNumber).val(telNumber.val() + text);
      var incomingaudioObj = new Audio();
      incomingaudioObj.src = 'assets/sounds/dtmf.mp3'
      incomingaudioObj.play();
  });

});