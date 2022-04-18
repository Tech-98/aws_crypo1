//Prices update every second
let timeInterval = 1000;

//Number of data points to generate
let numTimeIntervals = 100;

// these date has been generated using aws sagemaker
const bitcoinPrediction = [43850.98828125, 46854.0703125, 46387.890625, 46166.3984375, 46241.73046875, 45969.13671875, 44735.96484375, 45469.19921875, 44923.984375, 45191.5859375, 45050.01953125, 45173.12109375, 45419.49609375, 45232.1953125, 45412.78125, 45186.48828125, 45467.078125, 45875.9765625, 46285.88671875, 45751.578125, 46471.48828125, 47246.4453125, 47527.484375, 48243.078125, 48368.51953125, 47891.25390625, 47903.17578125, 48437.484375, 49228.87109375, 49870.11328125, 49656.30078125, 48906.8359375, 48875.3203125, 48498.140625, 48652.05859375, 48881.890625, 48702.4609375, 48759.07421875, 48943.05859375, 49043.71484375, 49056.78125, 49459.5703125, 49750.0390625, 49594.390625, 50123.578125, 50354, 51029.953125, 51634.08984375, 51838.78125, 51720.87109375];

const ethereumPrediction = [4159.2309570312, 4101.322265625, 4064.1064453125, 3916.9553222656, 3812.09375, 3781.201171875, 3764.6682128906, 3837.6508789062, 3861.0512695312, 3869.8696289062, 3916.0578613281, 3898.4663085938, 3910.8522949219, 3961.2800292969, 3950.5107421875, 3916.3928222656, 3908.3984375, 3903.9118652344, 4564.5551757812, 4752.2875976562, 4532.3247070312, 4386.3149414062, 4259.7143554688, 4206.2392578125, 4191.833984375, 4224.4755859375, 4217.298828125, 4047.841796875, 3918.9204101562, 3825.0671386719, 3766.7592773438, 3862.5891113281, 3899.0349121094, 3895.8674316406, 3893.9150390625, 3898.5578613281, 3918.8820800781, 3917.4353027344, 3934.1538085938, 3915.525390625, 3906.9475097656, 3898.4147949219, 3329.0249023438, 4674.9379882812, 5887.4682617188, 4753.2841796875, 4390.943359375, 4164.0053710938, 4122.0107421875, 4236.7607421875];

const litecoinPrediction = [131.6288146973, 146.1214904785, 150.7761535645, 175.4200439453, 185.3716430664, 188.1442565918, 187.2234191895, 190.4502563477, 191.5450592041, 189.2055206299, 189.8960113525, 186.6851806641, 186.9649353027, 188.7042541504, 188.6328125, 188.4992980957, 142.458480835, 102.9244613647, 134.9831695557, 202.5079040527, 250.4845275879, 262.3803100586, 266.9987792969, 254.4796142578, 241.790512085, 239.09425354, 237.7337493896, 234.2306976318, 234.4569854736, 235.2202148438, 232.6582183838, 238.767364502, 236.7271728516, 235.0863800049, 234.7071533203, 233.7780303955, 234.3793792725, 231.8276367188, 232.7348022461, 230.3683013916, 86.4917678833, 147.9382629395, 224.6315612793, 195.4396057129, 240.9892120361, 260.6848449707, 263.3112792969, 262.259185791, 261.5985107422, 256.8260803223];

const moneroPrediction = [181.8259277344, 194.3868408203, 158.8150939941, 178.8590393066, 164.7532958984, 162.2872314453, 162.8778991699, 164.9358825684, 175.2539672852, 169.7747192383, 178.002532959, 191.6427001953, 165.0803527832, 169.1931762695, 178.9166870117, 165.633605957, 181.557220459, 183.1489868164, 333.2518310547, 364.2606201172, 402.1937255859, 382.2484741211, 363.3553466797, 342.1212768555, 323.1696166992, 331.1628112793, 341.4770507812, 345.7270507812, 322.2108764648, 310.6993103027, 320.8213195801, 298.188659668, 311.2741088867, 324.8692016602, 321.8449707031, 323.4645690918, 331.1255493164, 319.8008728027, 305.732635498, 321.1433105469, 131.4427337646, 234.2663116455, 394.5703125, 286.7908325195, 334.1898193359, 344.8153686523, 354.4715576172, 349.659362793, 357.0481262207, 358.5848999023];

const tetherPrediction = [1.1622915268, 1.1850181818, 1.181899786, 1.1353144646, 1.1152677536, 1.1257748604, 1.1195440292, 1.0942593813, 1.0854398012, 1.0800600052, 1.0944881439, 1.1320888996, 1.1452987194, 1.1311188936, 1.1423033476, 1.1437879801, 1.1450651884, 1.1624748707, 0.580117166, 0.0189584922, 0.5319912434, 1.101000309, 1.4780367613, 1.6726520061, 1.7130763531, 1.542386651, 1.3808794022, 1.2611631155, 1.2342300415, 1.2261527777, 1.2215950489, 1.2163233757, 1.2079395056, 1.2154109478, 1.2254347801, 1.2230343819, 1.2213302851, 1.2123507261, 1.2035970688, 1.1755614281, 1.2225894928, 1.1780805588, -0.1162963361, 0.6472504139, 1.1857033968, 1.0887262821, 1.463721633, 1.6235072613, 1.6290507317, 1.5477970839];

const predictionX = [];
var price = [];
var ts = [];
var tweet;
var newsApi;
const currencyData = [{ name: "bitcoin", x: [], y: [] }]

let connection = new WebSocket("wss://8l4cwqyls2.execute-api.us-east-1.amazonaws.com/production");

//Log connected response
connection.onopen = function (event) {
    console.log("Connected: " + JSON.stringify(event));
    sendMessage("bitcoin");
    plotData();

};

//Output messages from the server
connection.onmessage = function (msg) {

    let result = JSON.parse(msg.data);
    data = result.price
    newsApi = result.news
    tweet = result.tweet;
    console.log("crypto_data length" + result.price.length);


    data.sort((a, b) => (a.ts > b.ts) ? 1 : ((b.ts > a.ts) ? -1 : 0))
    let count = 0
    price = [];
    ts = [];
    data.forEach(i => {

        price[count] = Number((i.price));
        ts[count] = new Date(Number(i.ts));

        count++
    })

    console.log("-------------------------")

    plotData();

}

//Log errors
connection.onerror = function (error) {
    console.log("WebSocket Error: " + JSON.stringify(error, ["message", "arguments", "type", "name"]));
}



//Send message to server
function sendMessage(msgText) {
    //Get text from form


    //Create message to be sent to server
    let msgObject = {
        action: "sendMessage",//Used for routing in API Gateway
        data: msgText
    };

    //Send message


    connection.send(msgText);



    currencyData[0].name = msgText;

    //Log result
    console.log("Message sent: " + msgText);
    plotPred(msgText);

}

// plote graph for predictions
function getPrediction(predictionData) {
    let date = new Date();
    let tempDate = new Date();

    for (let i = 0; i < predictionData.length; i++) {
        tempDate = date;
        date.setDate(date.getDate() + 1);

        predictionX.push(new Date(date))

    }

    currencyData[0].x = predictionX;
    currencyData[0].y = predictionData


    return currencyData
}
function getCurrencyData() {


    let date = new Date();
    let startTimestamp = date.getTime();

    currencyData[0].y = price;
    currencyData[0].x = ts;


    return currencyData;
}


function reqData(msgText) {
    sendMessage(msgText)
    plotData();
    plotPred(msgText);


}
function plotPred(msgText) {

    let currencyData;
    if (msgText == "bitcoin") {
        currencyData = getPrediction(bitcoinPrediction);
    } else if (msgText == "ethereum") {
        currencyData = getPrediction(ethereumPrediction);
    } else if (msgText == "litecoin") {
        currencyData = getPrediction(litecoinPrediction);
    } else if (msgText == "monero") {
        currencyData = getPrediction(moneroPrediction);
    } else if (msgText == "tether") {
        currencyData = getPrediction(tetherPrediction);
    }

    console.log("msg:" + msgText)



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
                color: 'rgba(49,130,189, 1)',
                size: 1
            }
        };

        //Get reference to Div where chart will be drawn
        let chartDiv = document.getElementById("pred" + "Div");

        // let chartTitle = currency.name.charAt(0).toUpperCase() + currency.name.slice(1);
        // //Upper case the start of the currency name and create title of chart
        // if (currency.name == "tether") {

        //     chartTitle = currency.name.charAt(0).toUpperCase() + currency.name.slice(1) + "  $" + currencyData[0].y[(currencyData[0].y.length - 1)].toFixed(3);
        // } else {
        //     chartTitle = currency.name.charAt(0).toUpperCase() + currency.name.slice(1) + "  $" + currencyData[0].y[(currencyData[0].y.length - 1)].toFixed(1);
        // }

        console.log("y-axis:" + currency.y[(currency.y.length) - 1])        //Set up graph
        let layout = {
            title: "",
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
    });
}

function plotData() {
    //Get test data
    // getPrediction();


    console.log("plote");

    console.log("news:" + newsApi.length);
    document.getElementById("news").innerHTML = ""
    for (i = 0; i < newsApi.length; i++) {

        var lineDiv = document.createElement("div");
        var lineA = document.createElement("a");

        lineA.className = "newsLine";
        lineDiv.className = "newsDiv";

        lineA.innerHTML = newsApi[i].title;
        lineA.href = newsApi[i].url;
        lineDiv.appendChild(lineA);
        document.getElementById("news").appendChild(lineDiv);

    }

    let currencyData = getCurrencyData();
    // let currencyData = getPrediction();


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
                color: 'rgba(49,130,189, 1)',
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
            paper_bgcolor: 'rgb(0,0,0,0)',
            showlegend: false

        };


        Plotly.newPlot('sentimentDiv', data, layout1);

    });

}

