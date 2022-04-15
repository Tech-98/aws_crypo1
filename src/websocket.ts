import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { Json } from "aws-sdk/clients/robomaker";
import { privateEncrypt } from "crypto";
const tableName ="cryptoData";
const docClient = new AWS.DynamoDB.DocumentClient();
export const listProd = async (event: any, context: any): Promise<APIGatewayProxyResult> => {
    const output = await docClient
      .scan({
        TableName: tableName,
      })
      .promise();
  
    return {
      statusCode: 200,
      body: JSON.stringify(output.Items),
    };

    // console.log(event);
    // return{
    //     'statusCode': 200,
    //     'body': JSON.stringify(event["requestContext"].get("connectionId"))
    // }
  };
  