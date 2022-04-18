import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS, { Endpoint } from "aws-sdk";
import { ObjectType } from "aws-sdk/clients/clouddirectory";
import { Json } from "aws-sdk/clients/robomaker";
import { privateEncrypt } from "crypto";
import { crypto } from "./handlers";
import axios from 'axios';

const tableName = "cryptoData";
const tableTweet = "tweet"
const docClient = new AWS.DynamoDB.DocumentClient();
const ENDPOINT = '8l4cwqyls2.execute-api.us-east-1.amazonaws.com/production'
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT })
const names: any = {};




const filterTweet = async (output: any) => {
  let sentiment = {
    positive: 0,
    negative: 0,
    neutral: 0
  };
  let count;
  // let data = JSON.parse(output.Items);
  if (output.Items) {
    let data = output?.Items;
    for (let i = 0; i < data.length; i++) {
      console.log(output.Items[i]);

      if (data[i].sentiment == "NEUTRAL") {
        sentiment.neutral = sentiment.neutral + 1;
      } else if (data[i].sentiment == "POSITIVE") {
        sentiment.positive = sentiment.positive + 1;
      } else if (data[i].sentiment == "NEGATIVE") {
        sentiment.negative = sentiment.negative + 1;
        // sentiment.negative=data.length;
      }
      // prices[i] = {price: Number(data[i].price), ts: data[i].cryptoTimestamp};
      // prices[i] = Number(data[i].price);
      //Store save data promise in array


    }
  }

  return sentiment;
}

const newsApi = async (currency: any) => {

  var crypto = currency;
  var result: { title: any; url: any; time: any; }[] = [];
  if (currency == "bitcoin") {
    crypto = "BTC"
  } else if (currency == "ethereum") {
    crypto = "ETH"
  } else if (currency == "litecoin") {
    crypto = "LTC"
  } else if (currency == "monero") {
    crypto = "XMR"
  } else if (currency == "tether") {
    crypto = "USDT"
  } else {
    crypto = "invalid"
  }
  const config = {
    method: 'get',
    url: 'https://cryptopanic.com/api/v1/posts/?auth_token=8c70f987d75a880f7a9224ccbd0f0a509394bb6c&currencies=' + crypto
  }

  let url = 'https://cryptopanic.com/api/v1/posts/?auth_token=8c70f987d75a880f7a9224ccbd0f0a509394bb6c&currencies=' + crypto;


  if (crypto == "invalid") {
    result = [{ title: "empty", url: "", time: "" }];
  } else {
    let res = await axios.get(
      url,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    let data = res.data.results;

    // 

    data.forEach((output: any) => {

      let newsObj = {
        title: output.title,
        url: output.url,
        time: output.published_at
      }
      result.push(newsObj);

    });
  }
  // console.log(res.status);

  return result;
}

const sendToOne = async (id: any, body: any) => {

  let output = await docClient
    .scan({
      TableName: tableName,
      FilterExpression: "currency = :a",
      ExpressionAttributeValues: {
        ":a": body
      }
    })
    .promise();
  let outputTweet = await docClient
    .scan({
      TableName: tableTweet,
      FilterExpression: "currency = :a",
      ExpressionAttributeValues: {
        ":a": body
      }
    })
    .promise();
  let sentiment = await filterTweet(outputTweet);
  let cryptoNews = await newsApi(body);

  var prices = [];


  if (output.Items) {
    let data = output?.Items;
    for (let i = 0; i < data.length; i++) {
      console.log(output.Items[i]);

      // prices[i] = Number(data[i].price);
      prices[i] = { price: Number(data[i].price), ts: data[i].cryptoTimestamp };
      //Store save data promise in array

    }
  }
  try {
    await client.postToConnection({

      'ConnectionId': id,
      'Data': Buffer.from(JSON.stringify({ price: prices, tweet: sentiment, news: cryptoNews }))
      // 'Data': Buffer.from(JSON.stringify(body))
    }).promise();
  } catch (e) {
    console.log(e);
  }
}

const sendToAll = async (ids: any, body: any) => {
  const all = ids.map(((i: any) => sendToOne(i, names[i])));
  return Promise.all(all);
};






export const listProd = async (event: any, context: any): Promise<APIGatewayProxyResult> => {
  var prices = [];

  const connectionId = event.requestContext.connectionId;
  // const routId = event.requestContext.routeKey;
  let body = {};
  try {
    if (event.body) {
      body = JSON.parse(event.body);
    }
  } catch (e) {
    //
  }


  if (typeof event.body == "undefined") {
    // event.body = {"data": "empty"};
    event.body = "empty";
  }

  names[connectionId] = event.body;

  console.log("event:" + event.body);

  let output = await docClient
    .scan({
      TableName: tableName,
      FilterExpression: "currency = :a",
      ExpressionAttributeValues: {
        ":a": event.body
      }
    })
    .promise();
  let outputTweet = await docClient
    .scan({
      TableName: tableTweet,
      FilterExpression: "currency = :a",
      ExpressionAttributeValues: {
        ":a": event.body
      }
    })
    .promise();
  let sentiment = await filterTweet(outputTweet);




  if (output.Items) {
    let data = output?.Items;
    for (let i = 0; i < data.length; i++) {
      console.log(output.Items[i]);

      prices[i] = { price: Number(data[i].price), ts: data[i].cryptoTimestamp };
      // prices[i] = Number(data[i].price);
      //Store save data promise in array

    }
  }

  // prices.sort();
  // event.body

  if (event.body == "update") {
    // event.body = {"data": "empty"};

    await sendToAll(Object.keys(names), names[connectionId]);
    // prices = ["sent to all"];
  }

  let cryptoNews = await newsApi(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      price: prices,
      tweet: sentiment,
      news: cryptoNews
    })
    // body: JSON.stringify("message received")
  };


};
function ts(price: any, ts: any, timastamp: any) {
  throw new Error("Function not implemented.");
}

