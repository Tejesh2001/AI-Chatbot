const dialogflow = require('@google-cloud/dialogflow'); 
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const e = require('express');
const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({
  extended:false
}))
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */


app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});



app.post('/send-msg', (request, response) => {
  console.log("This was reached" + JSON.stringify(request.body));
  console.log("FEEEfef")
  console.log("This was reached" + request.body.button_press);

  if (typeof request.body.button_press != "undefined") {
  console.log("Button \n" + request.body.button_press);
  runSample(request.body.button_press).then(data => {
    console.log('This was sent');
    console.log({Reply:data});
    response.send({Reply:data})
  })  
} else {
  runSample(request.body.MSG).then(data => {
    response.send({Reply:data})
  })
}
});



async function runSample(msg, projectId = 'tourist-recommendations-kpxlnu') {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({keyFilename:"recommendations.json"});
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
  console.log(msg + "  message");
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request); 
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentMessages}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return result.fulfillmentMessages;
}
app.listen(port, () => {
    console.log("listening on port " + port)
})