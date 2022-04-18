//Prices update every second
let timeInterval = 1000;

//Number of data points to generate
let numTimeIntervals = 100;

var price = [];
var ts = [];
var tweet;
var news;
const currencyData = [{ name: "bitcoin", x: [], y: [] }]

let connection = new WebSocket("wss://8l4cwqyls2.execute-api.us-east-1.amazonaws.com/production");

//Log connected response
connection.onopen = function (event) {
    console.log("Connected: " + JSON.stringify(event));
    sendMessage("bitcoin");

};

//Output messages from the server
connection.onmessage = function (msg) {

    //  data = JSON.stringify(msg.data);
    let result = JSON.parse(msg.data);
    data = result.price
    news = result.news
    tweet = result.tweet;

    console.log(news);
    console.log("positive:" + tweet.positive);
    console.log("negative:" + tweet.negative);
    console.log("neutral:" + tweet.neutral);

    data.sort((a, b) => (a.ts > b.ts) ? 1 : ((b.ts > a.ts) ? -1 : 0))
    let count = 0
    price = [];
    ts = [];
    data.forEach(i => {

        // index = Number(i.ts)-1586131200000;
        price[count] = Number((i.price));
        ts[count] = new Date(Number(i.ts));
        // ts[count] = Number(i.ts);

        // console.log("index:" + count + "price:" + price[count] + "ts:" + ts[count]);

        count++
    })

    console.log(count);
    console.log("lenght: " + data.lenght);

    // console.log("data:" + JSON.stringify(msg.data));
    console.log("-------------------------")

}

//Log errors
connection.onerror = function (error) {
    console.log("WebSocket Error: " + JSON.stringify(error, ["message", "arguments", "type", "name"]));
}

// function sort(arr) {

//     let temp;
//     let tempsmall;
//     let arrayData = [];

//     while (j > tempsmall && j < temp)
//         for (i = 0; i < arr.lenght; i++) {


//         }
//     return arrayData;
// }

//Send message to server
function sendMessage(msgText) {
    //Get text from form
    // let msgText = document.forms[0].inputString.value;

    //Create message to be sent to server
    let msgObject = {
        action: "sendMessage",//Used for routing in API Gateway
        data: msgText
    };

    //Send message
    // connection.send(JSON.stringify(msgObject));

    connection.send(msgText);



    currencyData[0].name = msgText;

    //Log result
    console.log("Message sent: " + msgText);
}
//Add dummy data for four currencies
function getCurrencyData() {

    //Create Date class so we can obtain a starting timestamp
    let date = new Date();

    //Starting point for generation of data
    let startTimestamp = date.getTime();

    currencyData[0].y = price;
    currencyData[0].x = ts;


    return currencyData;
}


function reqData(msgText) {
    sendMessage(msgText)
    plotData();
    // console.log("sent");

}

function plotData() {
    //Get test data

    for (i = 0; i < 10; i++) {

        var line = document.createElement("p");
        line.className = "line";
        line.innerHTML = "|";
        document.getElementById("news").appendChild(line);

    }

    let currencyData = getCurrencyData();


    //Work through the four currencies
    currencyData.forEach(currency => {
        //Specify how chart should be drawn
        let trace = {
            x: currency.x,
            y: currency.y,
            mode: 'lines',
            name: currency.name,
            type: 'scatter',
            marker: {
                color: 'rgb(21, 64, 82)',
                size: 1
            }
        };

        //Get reference to Div where chart will be drawn
        let chartDiv = document.getElementById("crypto" + "Div");

        let chartTitle = currency.name.charAt(0).toUpperCase() + currency.name.slice(1);
        //Upper case the start of the currency name and create title of chart
        if (currency.name == "tether") {

            chartTitle = currency.name.charAt(0).toUpperCase() + currency.name.slice(1) + "  $" + currencyData[0].y[(currencyData[0].y.length - 1)].toFixed(3);
        } else {
            chartTitle = currency.name.charAt(0).toUpperCase() + currency.name.slice(1) + "  $" + currencyData[0].y[(currencyData[0].y.length - 1)].toFixed(1);
        }

        console.log("y-axis:" + currency.y[(currency.y.length) - 1])        //Set up graph
        let layout = {
            title: chartTitle,
            xaxis: {
                title: 'Time'
            },
            yaxis: {
                autorange: true,

                title: 'Price'
            },
            paper_bgcolor: 'rgb(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        //Data for graph is an array of lines for graph
        let data1 = [trace];

        //Plot data
        Plotly.newPlot(chartDiv, data1, layout);
        // Plotly.restyle(chartDiv, 'y', data1);
        // remove at index 1
        // Plotly.newPlot(chartDiv, data1, layout);
        // Plotly.deleteTraces(chartDiv, 0); 
        // Plotly.addTraces(chartDiv, data1);
        // Plotly.newPlot(chartDiv, data1, layoust);
        var ultimateColors = [

            ['rgb(56, 75, 126)', 'rgb(18, 36, 37)', 'rgb(34, 53, 101)', 'rgb(36, 55, 57)', 'rgb(6, 4, 4)'],

            ['rgb(177, 127, 38)', 'rgb(205, 152, 36)', 'rgb(99, 79, 37)', 'rgb(129, 180, 179)', 'rgb(124, 103, 37)'],

            ['rgb(33, 75, 99)', 'rgb(79, 129, 102)', 'rgb(151, 179, 100)', 'rgb(175, 49, 35)', 'rgb(36, 73, 147)'],

            ['rgb(146, 123, 21)', 'rgb(177, 180, 34)', 'rgb(206, 206, 40)', 'rgb(175, 51, 21)', 'rgb(35, 36, 21)'],

            ['rgb(166, 216, 237)', 'rgb(204, 200, 203)', 'rgb(96, 166, 191)']


        ];

        var data = [{

            values: [tweet.positive, tweet.negative, tweet.neutral],

            labels: ['Positive', 'Negative', 'Neutral'],
            hole: .4,
            type: 'pie',
            marker: { colors: ultimateColors[4] },
            // color: 'rgb(21, 64, 82)',
            textinfo: "label+percent",
            textposition: "outside",

        }];


        var layout1 = {
            title: "Sentiment analysis",
            // color: 'rgb(21, 64, 82)',
            paper_bgcolor: 'rgb(0,0,0,0)',
            showlegend: false
            // height: 400,
            // width: 500

        };


        Plotly.newPlot('sentimentDiv', data, layout1);

    });
}

//Plot data when window first loads
// window.onload = plotData;
// window.onload = sendMessage("bitcoin");

//Replot data every 1000 ms.
setInterval(plotData, 1000);
