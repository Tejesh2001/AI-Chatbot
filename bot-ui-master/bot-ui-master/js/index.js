var $messages = $('.messages-content');
var serverResponse = "wala";


var suggession;
//speech reco
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
}

$('#start-record-btn').on('click', function(e) {
  recognition.start();
});

recognition.onresult = (event) => {
  const speechToText = event.results[0][0].transcript;
 document.getElementById("MSG").value= speechToText;
  //console.log(speechToText)
  insertMessage()
}


function listendom(no){
  console.log(no)
  //console.log(document.getElementById(no))
document.getElementById("MSG").value= no.innerHTML;
  insertMessage();
}

$(window).load(function() {
  $messages.mCustomScrollbar();
  setTimeout(function() {
    serverMessage("Please write ready to start");
  }, 100);

});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}



function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');

  if (typeof msg == 'string') {  
  fetchmsg()  
  } else {
    console.log("Not a string ");
  }
  $('.message-input').val(null);
  updateScrollbar();

}

document.getElementById("mymsg").onsubmit = (e)=>{
  e.preventDefault() 
  insertMessage();
  //serverMessage("hello");
 // speechSynthesis.speak( new SpeechSynthesisUtterance("hello"))
}

function myFunction(value) {
    
  var url = 'http://localhost:5000/send-msg';
  var val = value
  console.log("this is value" + "  " + val);
  var data = new URLSearchParams();
  butId = "button_press";
  data.append((butId), (val));
  console.log("this is value sttinified" + "  " + JSON.stringify(val));
  return fetch(url, {
        method: 'POST',
        body:data,
      }).then(res => res.json())
       .then(response => {
         console.log(typeof response.Reply);
        console.log( " THIS IS THE  RESPONSE not stringified " + response);   
        console.log( " THIS IS THE  RESPONSE stringified" + JSON.stringify(response));   
      /*  console.log( " THIS IS THE  RESPONSE reply stringified" + JSON.stringify(response.Reply));        
        console.log( " THIS IS THE TEXT RESPONSE STRINGIFIED " +JSON.stringify(response.text));        
        console.log( "THIS IS THE TEXT RESPONSE " +response.Reply.text);
        
        console.log( "THIS IS THE platfro RESPONSE " +response.Reply.platform);
        
        console.log( "THIS IS THE message RESPONSE " +response.Reply.message);*/
        //prints to screen
        //serverMessage(response.Reply);
        //serverMessage(response["Reply"]["text"]["text"]);
        //serverMessage(response);
        serverMessage(response.Reply);
        speechSynthesis.speak( new SpeechSynthesisUtterance(response.Reply))       
       })
        .catch(error => console.error('Error h:', error));
}





function serverMessage(response2) {


  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="css/bot.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
  s = JSON.stringify(response2)  ;



  setTimeout(function() {
    $('.message.loading').remove();
    var url = "css/bot.png";
    var img = new Image(200, 200);
    img.src = url;
    var button = `<button id="button_press" value="print this button" onclick="myFunction()" >Try it</button>`;
    var htmlDoc = `<div class="chip"> <img src= ${url} alt="Person" width="96" height="96">` + button +`</div>`;
    console.log("this is response 2" + response2);
    console.log("this is response 2" + JSON.stringify(response2));
    if (typeof  response2 == "string") {       
   $('<div class="message new"><figure class="avatar"><img src="css/bot.png" /></figure>' + response2 + '</div>').appendTo($('.mCSB_container')).addClass('new');
    } else {      
      console.log(JSON.stringify(response2)  + "  This is response");
      var i = 0;
      var htmlDoc;
      //add pair for picture of place and name of place
      (response2).forEach(element => {
        var eleMessage = element.text.text;
        jMessage = JSON.stringify(eleMessage);
        console.log("THESE ARE LIST ELEMENTS" +  eleMessage);        
        console.log(JSON.stringify(i));
        butId = "button_press";
        console.log(butId);
        console.log(" ELEMESSAGE IS " +  eleMessage);
        //var button = `<button id= ${butId} value= ${eleMessage} onclick="myFunction('${eleMessage.toString()}')> ${ eleMessage}</button>`; 
        var button = `<button id= ${butId} value= ${eleMessage} onclick="myFunction('${eleMessage}')"> ${ eleMessage}</button>`;               
        console.log(button);
        htmlDoc = `<div class="chip"> <img src= ${url} alt="Person" width="96" height="96">` + button + `</div>`;
        console.log(htmlDoc);
        $(`<div class="message new"><figure class="avatar"><img src="css/bot.png" /></figure>${htmlDoc}</div>`).appendTo($('.mCSB_container')).addClass('new');
        i++;
        });


    // $(`<div class="message new"><figure class="avatar"><img src="css/bot.png" /></figure>${htmlDoc}</div>`).appendTo($('.mCSB_container')).addClass('new');
    }
    updateScrollbar();
  }, 100 + (Math.random() * 20) * 100);

}


function fetchmsg(){

     var url = 'http://localhost:5000/send-msg';
     //Convert button id to button class
      
      const data = new URLSearchParams();
      for (const pair of new FormData(document.getElementById("mymsg"))) {
          data.append(pair[0], pair[1]);
          console.log(pair)
      }            
      console.log("abc",data)
       return fetch(url, {
          method: 'POST',
          body:data
        }).then(res => res.json())
         .then(response => {
          console.log(response);
          //prints to screen
          serverMessage(response.Reply);
          speechSynthesis.speak( new SpeechSynthesisUtterance(response.Reply))       
         })
          .catch(error => console.error('Error h:', error));

}


