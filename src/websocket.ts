import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS, { Endpoint } from "aws-sdk";
import { ObjectType } from "aws-sdk/clients/clouddirectory";
import { Json } from "aws-sdk/clients/robomaker";
import { privateEncrypt } from "crypto";
const tableName = "cryptoData";
const docClient = new AWS.DynamoDB.DocumentClient();
const ENDPOINT = '8l4cwqyls2.execute-api.us-east-1.amazonaws.com/production'
const client = new AWS.ApiGatewayManagementApi({endpoint: ENDPOINT})
const names:any= {};

const sendToOne = async(id:any, body:any) =>{

  let output = await docClient
  .scan({
    TableName: tableName,
    FilterExpression: "currency = :a",
    ExpressionAttributeValues: {
      ":a": body
    }
  })
  .promise();
var prices = [];


if (output.Items) {
  let data = output?.Items;
  for (let i = 0; i < data.length; i++) {
    console.log(output.Items[i]);

    // prices[i] = Number(data[i].price);
    prices[i] = {price: Number(data[i].price), ts: data[i].cryptoTimestamp};
    //Store save data promise in array

  }
}
  try{
    await client.postToConnection({

      'ConnectionId': id,
      'Data': Buffer.from(JSON.stringify({price: prices}))
    }).promise();
  }catch(e){
    console.log(e);
  }
}

const sendToAll =async (ids:any,body:any) => {
  const all = ids.map(((i: any) => sendToOne(i,names[i])));
  return Promise.all(all);
};

export const listProd = async (event: any, context: any): Promise<APIGatewayProxyResult> => {
  

  const connectionId = event.requestContext.connectionId;
  // const routId = event.requestContext.routeKey;
  let body = {};
  try{
    if(event.body){
      body = JSON.parse(event.body);
    }
  }catch(e){
    //
  }


  if (typeof event.body == "undefined"){
    // event.body = {"data": "empty"};
    event.body = "empty";
  }
  
  names[connectionId]= event.body;

  console.log("event:" +event.body);

  let output = await docClient
    .scan({
      TableName: tableName,
      FilterExpression: "currency = :a",
      ExpressionAttributeValues: {
        ":a": event.body
      }
    })
    .promise();
  var prices = [];

  
  if (output.Items) {
    let data = output?.Items;
    for (let i = 0; i < data.length; i++) {
      console.log(output.Items[i]);

      prices[i] = {price: Number(data[i].price), ts: data[i].cryptoTimestamp};
      // prices[i] = Number(data[i].price);
      //Store save data promise in array

    }
  }
  // event.body

  if (event.body == "sendAll"){
    // event.body = {"data": "empty"};
    
    await sendToAll(Object.keys(names), names[connectionId]);
    prices = ["sent to all"];
  }

  return {
    statusCode: 200,
    body: JSON.stringify(prices)
    // body: JSON.stringify("message received")
  };


};
function ts(price: any, ts: any, timastamp: any) {
  throw new Error("Function not implemented.");
}

