const WebSocket = require('ws');

let connection = new WebSocket("wss://a53ec6unt0.execute-api.us-east-1.amazonaws.com/test");

//Log connected response
connection.onopen = function (event) {
    console.log("Connected: " +JSON.stringify(data) );

};

//Output messages from the server
connection.onmessage = function (msg) {
    document.getElementById("messages").innerHTML += ("Server message: " + msg.data + "<br />");
    console.log("Message received.");
}

//Log errors
connection.onerror = function (error) {
    console.log("WebSocket Error: " + JSON.stringify(error, ["message", "arguments", "type", "name"]));
}

//Send message to server
function sendMessage() {
    //Get text from form
    let msgText = document.forms[0].inputString.value;

    //Create message to be sent to server
    let msgObject = {
        action: "sendMessage",//Used for routing in API Gateway
        data: msgText
    };

    //Send message
    connection.send(JSON.stringify(msgObject));

    //Log result
    console.log("Message sent: " + JSON.stringify(msgObject));
}