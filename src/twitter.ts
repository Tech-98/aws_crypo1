// import { APIGatewayProxyEvent } from "aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { analyse } from "./analysis"
//Module that reads keys from .env file
const dotenv = require('dotenv');

const axios = require('axios');

// import { DataDownloader } from './demo_2.js';

//Node Twitter library
const Twitter = require('twitter');

//Copy variables in file into environment variables
dotenv.config({ path: '.env' });

//Set up the Twitter client with the credentials
// let client = new Twitter({
//     consumer_key: process.env.CONSUMER_KEY,
//     consumer_secret: process.env.CONSUMER_SECRET,
//     access_token_key: process.env.ACCESS_TOKEN_KEY,
//     access_token_secret: process.env.ACCESS_TOKEN_SECRET
// });

let client = new Twitter({
    consumer_key: 'gRKCeB7qae5MWRgqsKtK3OydY',
    consumer_secret: 'hoWByZlKlNrutPnlGc3WtYZ8nlflwQHgEVxV1ZwQ1jhrI0qpe2',
    access_token_key: '1501145985451499520-43zRJboUP9aGwQGzi9AIvGm3yduhU2',
    access_token_secret: '2dTtMDmVNgyv58ICvRBhjghB1IG1fHn7PlLebA2QYvElZ'
});

//Downloads and outputs tweet text
export const searchTweets = async (event: APIGatewayProxyEvent) => {
    // async function searchTweets() {


    try {
        //Set up parameters for the search
        let searchParams = {
            q: "bitcoin",
            count: 100000,
            lang: "en",
            // until: '2022-03-01'
            since: "2022-03-08",
            until: "2022-03-23",
            // result_type: "popular"
        };

        //Wait for search to execute asynchronously
        // result = await client.get('search/tweets', searchParams);
        // console.log(JSON.stringify(result));

        // console.log("result:");
        //Output the result
        // result.statuses.forEach((tweet: any) => {
        //     console.log("Tweet id: " + tweet.created_at + ". Tweet text: " + tweet.text);
        // });
        // console.log("-------------");

        // let result = await axios.get('https://cryptopanic.com/api/v1/posts/?auth_token=851aab2a93d549b73cdc6e4c731f14cc29b2dfe5&currencies=BTC&date=2022-03-01');
        // console.log("result:"); 
        // // console.log(result);
        // // console.log(JSON.stringify(result));

        // //Output the result
        // result.data.results.forEach((tweet)=>{
        //     console.log("|news time: " + tweet.published_at + "| news text: " + tweet.title);
        // });

        let result = await axios.get('https://o74vkm3sl5.execute-api.us-east-1.amazonaws.com/products');
        console.log(result);
        return result;
    }
    catch (error) {
        console.log(JSON.stringify(error));
        console.log("error")
        //return error;
    }

};

export const searchTweets1 = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // const reqBody = JSON.parse(event.body as string);
        const reqBody = JSON.parse(event.body as string);
        //await schema.validate(reqBody, { abortEarly: false });

        // const reqBody = {
        //   text: "bitcoin"
        // };
        let product = {
            statusCode: 201,
            body: JSON.stringify({ "message": "created" }),
        };
        let productRes = {
            statusCode: 201,
            body: JSON.stringify({}),
        };
        // await docClient
        //   .put({
        //     TableName: tableName,
        //     Item: product,
        //   })
        //   .promise();
        let searchParams = {
            // q: reqBody.search,
            q: reqBody.text,
            count: 100000,
            lang: "en",
            // until: '2022-03-01'
            since: "2022-03-08",
            until: "2022-03-23",
            // result_type: "popular"
        };

        //Wait for search to execute asynchronously
        let result = await client.get('search/tweets', searchParams);


        for (let i = 0; i < result.statuses.length; i++) {
            setTimeout(async function timer() {



                //     console.log("Tweet id: " + tweet.created_at + ". Tweet text: " + tweet.text);
                // console.log("----Tweet id: " + Date.parse(tweet.created_at) / 1000 + " -----. Tweet text: " + tweet.text);
                product = {
                    statusCode: 201,
                    body: product.body + JSON.stringify({
                        date: Date.parse(result.statuses[i].created_at) / 1000,
                        text: result.statuses[i].text,
                        currency: reqBody.text
                    }),

                }

                let Sentiment = await analyse(result.statuses[i].text);
                let sent = JSON.parse(Sentiment.body);
                let tweetDate = Date.parse(result.statuses[i].created_at) / 1000;
                let tweets = {
                    tweetTimestamp: tweetDate.toString(),
                    currency: reqBody.text,
                    text: result.statuses[i].text,
                    sentiment: JSON.stringify(sent.sentiment)

                }

                let putResult = await docClient
                    .put({
                        TableName: "tweet",
                        Item: tweets,
                    })
                    .promise();
                productRes = {
                    statusCode: 201,
                    body: productRes.body + JSON.stringify({
                        date: putResult
                    }),

                }

            }, i * 300);
        }









        // let currencies = ["BTC", "ETH", "MKR", "LTC", "MKR"];
        // for (let i = 0; i < currencies.length; i++) {
        //   setTimeout(async function timer() {
        //     console.log("currency:" + currencies[i]);
        //     let result = await axios.get('https://cryptopanic.com/api/v1/posts/?auth_token=851aab2a93d549b73cdc6e4c731f14cc29b2dfe5&currencies=' + currencies[i]);
        //     console.log("result:");
        //     // console.log(result);
        //     // console.log(JSON.stringify(result));

        //     //Output the result
        //     result.data.results.forEach(async (tweet: { published_at: string; title: string; }) => {

        //       let tweets = {
        //         tweetTimestamp: tweet.published_at.toString(),
        //         currency: currencies[i],
        //         text: tweet.title

        //       }

        //       let putResult = await docClient
        //         .put({
        //           TableName: "tweet",
        //           Item: tweets,
        //         })
        //         .promise();


        //       // product.body = JSON.parse(putResult);
        //       console.log("|news time: " + tweet.published_at + "| news text: " + tweet.title);
        //     });
        //   }, i * 1000);
        // }






        // return {
        //   statusCode: 201,
        //   headers,
        //   body: JSON.stringify(putResult),
        // };
        return product;

    } catch (e) {
        return handleError(e);
        // return product
    }

};


function handleError(e: unknown): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
    throw new Error("Function not implemented.");
}
//Call function to search for tweets with specified subject
// searchTweets(event: APIGatewayProxyEvent);

