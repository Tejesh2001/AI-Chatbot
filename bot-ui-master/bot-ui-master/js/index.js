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
    serverMessage("Hi I am your holiday agent! Please write hi to start!");
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
  //Added this and and option
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
 // serverMessage("You can choose between these holiday options!");
  //speechSynthesis.speak( new SpeechSynthesisUtterance("You can choose between these holiday options!"));
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
        serverMessage(response.Reply);
        //serverMessage(response["Reply"]["text"]["text"]);
        //serverMessage(response);
    
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
   showToScreen(response2);
    } else {      
    //  $('<div class="message new"><figure class="avatar"><img src="css/bot.png" /></figure>' + "Based on your answer, I recommend these following options" + '</div>').appendTo($('.mCSB_container')).addClass('new');
      console.log(JSON.stringify(response2)  + "  This is response");
      var i = 0;
      var htmlDoc;
      //add pair for picture of place and name of place
      
      cards = ``;
      (response2).forEach(element => {       

       if (typeof element.text != 'undefined') {
        console.log("Nan indexjs " +  Number(element.text.text));
        if (Number.isNaN(Number(element.text.text))) {
          console.log("Nan Number " + Number(element.text.text));
          showToScreen(element.text.text);
          console.log("Nan " +  element.text.text);
          return;
        }  
       //  showToScreen(element.text.text.toString());
         //https://stackoverflow.com/questions/31399411/go-to-next-iteration-in-javascript-foreach-loop
         return;
       }      
      console.log(JSON.stringify(response2.JSON)  + "  This is response");
      if (element.card == null) {
        showToScreen("Please reload the screen. Network error occured");
        return;
      }
        eleMessage = element.card.title;
        elePicture = element.card.imageUri;
        eleText = element.card.subtitle;
        console.log(eleText);
        console.log(JSON.stringify(element));   
        console.log("This is eleText " + eleText);
        butId = "button_press";
        console.log(butId);
        var label = `<span class="label">${eleText}</span>`
        var card_image = `<div class="card-image" style="background-image: url(${elePicture});"></div>`;
        //var button = `<button id= ${butId} value= ${eleMessage} onclick="myFunction('${eleMessage.toString()}')> ${ eleMessage}</button>`; 
        var button = `<button class = "card-button" button id= ${butId} value= ${eleMessage} onclick="myFunction('${eleMessage}')"> ${ eleMessage}</button>`;               
        console.log(button);
        if (!(eleText == '' || eleText == ' ')) {
          var card = `<div class="card"> ${label}
          ${card_image}
            <h>${button}</h></div>`;
        } else {
          var card = `<div class="card">
          ${card_image}
            <h>${button}</h></div>`;
        }
         cards += `  ` + card + `  `;
      //  htmlDoc = `<div class="card"> <img src= ${url} alt="Person" style="100%>` + but + `</div>`;
        console.log(card);
      //  showToScreen(card);
        return cards;
        i++;
        });
        console.log("THESE ARE CARDs" + cards);
        a = `<div class="row">${cards}</div>`;
        showToScreen(a);


    // $(`<div class="message new"><figure class="avatar"><img src="css/bot.png" /></figure>${htmlDoc}</div>`).appendTo($('.mCSB_container')).addClass('new');
    }
    updateScrollbar();
  }, 100 + (Math.random() * 20) * 100);
}


function showToScreen(response) {

  if (response == `<div class="row"></div>`) {
    return;
  }
  console.log("THIS IS RESPONSE IN SCREEN " +  response);
  $('<div class="message new"><figure class="avatar"><img src="css/bot.png"></figure>' + response + '</div>').appendTo($('.mCSB_container')).addClass('new');
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
          console.log(response.Reply);
          console.log("I AM CALLED WHEN BUTTON IS PRESSED");
          //prints to screen
          serverMessage(response.Reply);
         // speechSynthesis.speak( new SpeechSynthesisUtterance(response.Reply))       
         })
          .catch(error => console.error('Error h:', error));

}


