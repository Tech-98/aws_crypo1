import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
// import { v4 } from "uuid";
import * as yup from "yup";
import { analyse } from "./analysis"

import axios from 'axios';
import Twitter from 'twitter';
import { toNamespacedPath } from "path";

//Copy variables in file into environment variables

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

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const docClient = new AWS.DynamoDB.DocumentClient();
// const tableName = "ProductsTable";
const tableName = "cryptoData";
const tweetTable = "tweet";
const headers = {
  "content-type": "application/json",
};

const schema = yup.object().shape({
  currency: yup.string().required(),
  start: yup.number().required(),
  end: yup.number().required(),
});

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const reqBody = JSON.parse(event.body as string);

    //await schema.validate(reqBody, { abortEarly: false });

    const product = {
      ...reqBody,
      productID: "sdf89sd78s7d7f",
    };

    let putResult = await docClient
      .put({
        TableName: tableName,
        Item: product,
      })
      .promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(putResult),
    };
  } catch (e) {
    return handleError(e);
  }
};

export const searchTweets = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // const reqBody = JSON.parse(event.body as string);
    const reqBody = JSON.parse(event.body as string);
    //await schema.validate(reqBody, { abortEarly: false });

    // const reqBody = {
    //   text: "bitcoin"
    // };
    let product = {
      statusCode: 201,
      headers,
      body: JSON.stringify({ "message": "created" }),
    };
    let productRes = {
      statusCode: 201,
      headers,
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
      since: "2022-03-13",
      until: "2022-04-11",
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
          headers,
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
          sentiment: sent.replace(/['"]+/g, '')

        }

        let putResult = await docClient
          .put({
            TableName: "tweet",
            Item: tweets,
          })
          .promise();
        productRes = {
          statusCode: 201,
          headers,
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

class HttpError extends Error {
  constructor(public statusCode: number, body: Record<string, unknown> = {}) {
    super(JSON.stringify(body));
  }
}

const fetchProductById = async (id: string) => {
  const output = await docClient
    .get({
      TableName: tableName,
      Key: {
        productID: id,
      },
    })
    .promise();

  if (!output.Item) {
    throw new HttpError(404, { error: "not found" });
  }

  return output.Item;
};

const handleError = (e: unknown) => {
  if (e instanceof yup.ValidationError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        errors: e.errors,
      }),
    };
  }

  if (e instanceof SyntaxError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `invalid request body format : "${e.message}"` }),
    };
  }

  if (e instanceof HttpError) {
    return {
      statusCode: e.statusCode,
      headers,
      body: e.message,
    };
  }

  throw e;
};

export const getProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const product = await fetchProductById(event.pathParameters?.id as string);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return handleError(e);
  }
};

export const updateProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;

    await fetchProductById(id);

    const reqBody = JSON.parse(event.body as string);

    await schema.validate(reqBody, { abortEarly: false });

    const product = {
      ...reqBody,
      productID: id,
    };

    await docClient
      .put({
        TableName: tableName,
        Item: product,
      })
      .promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return handleError(e);
  }
};

export const deleteProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;

    await fetchProductById(id);

    await docClient
      .delete({
        TableName: tableName,
        Key: {
          productID: id,
        },
      })
      .promise();

    return {
      statusCode: 204,
      body: "",
    };
  } catch (e) {
    return handleError(e);
  }
};

export const listProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
if (typeof event.body == "undefined"){
  event.body = "test";
}
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

      prices[i] = Number(data[i].price);
      //Store save data promise in array

    }
  }
  // event.body

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(prices)
    // body: JSON.stringify("message received")
  };


};   // console.log(event);
// return{
//     'statusCode': 200,
//     'body': JSON.stringify(event["requestContext"].get("connectionId"))
// }
// export class DataDownloader {
//   url;
//   dataDownloader: any;

//   constructor(url: any) {
//     this.url = url;
//   }

//   async getCryptoData(start_date: any, end_date: any, currency: string) {

//     let data = await CoinGeckoClient.coins.fetchMarketChartRange(currency, {
//       from: start_date,
//       to: end_date,
//     });
//     return data;
//   }

//   async downloadData1(event: APIGatewayProxyEvent, start_date: any, end_date: any, currency: string) {

//     // try {
//     //   //Get promise to download data
//     //   // let downloadPromise = this.dataDownloader.getDataFromWebService(start_date, end_date, currency);

//     //   //Execute promise and wait for result.
//     //   // let result = await downloadPromise;
//     //   // // let result = JSON.parse(data);
//     //   // // console.log("Data downloaded: " + JSON.stringify(result));
//     //   // // console.log("\033c");
//     //   // // console.log("price:" + result.prices);
//     //   // console.log(result)
//     //   // var lines = process.stdout.getWindowSize()[1];
//     //   // for (var i = 0; i < 100; i++) {
//     //   //   console.log('\r\n');
//     //   // }
//     //   // result.data.prices.forEach((prices: any) => {
//     //   //   let priceData = prices.toString();
//     //   //   let splitPrice = priceData.split(",", 2);
//     //   //   console.log("prices: " + splitPrice[0] + "," + splitPrice[1]);
//     //   //   console.log("prices: " + prices);
//     //   //   createCrypto(event, currency, splitPrice[0], splitPrice[1]);
//     //   // });
//     //   // //Pass data to database to store
//     //   // let storeDataPromise = this.dbInterface.storeData(data);

//     //   //  console.log("data" + result.success);
//     //   // let result = await storeDataPromise;
//     //   // console.log("Result: " + result);
//     //   // result.data.forEach((tweet)=>{
//     //   //     console.log("Tweet id: " + tweet.id + ". Tweet text: " + tweet.text);
//     //   // });
//     //   return result;
//     // }
//     // catch (err) {
//     //   console.error("Error occurred: " + err);
//     // }


//     let response;
//     try {
//       // const ret = await axios(url);
//       response = {
//         'statusCode': 200,
//         'body': JSON.stringify({
//           message: 'hello world',
//           // location: ret.data.trim()
//         })
//       }
//     } catch (err) {
//       console.log(err);
//       return err;
//     }

//     return response;
//   }

// }

export const getCryptoData = async (start_date: any, end_date: any, currency: string) => {

  let data = await CoinGeckoClient.coins.fetchMarketChartRange(currency, {
    from: start_date,
    to: end_date,
  });
  return data;
}

export const getCryptoDataMonthly = async (start_date: any, end_date: any, currency: string) => {

  let data = await CoinGeckoClient.coins.fetchHistory(currency, {
    date: start_date
  });
  return data;
}

// , start_date: any, end_date: any, currency: string

async function sleep(millis: any) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

export const createCrypto = async (event: APIGatewayProxyEvent, cryptoCurrency: any, timastamp: any, cryptoPrice: any): Promise<APIGatewayProxyResult> => {


  try {
    const reqBody = JSON.parse(event.body as string);
    // let data;
    await schema.validate(reqBody, { abortEarly: false });

    // let downloadPromise = getCryptoData(1609500639, 1647603106, "bitcoin");
    //let result = await downloadPromise;
    // let downloadPromise = getCryptoData(1646438400, 1648038491, "monero");
    // let downloadPromise = getCryptoData(1629763200, 1648038491, "bitcoin");

    let downloadPromise = getCryptoData(reqBody.start, reqBody.end, reqBody.currency);

    //Execute promise and wait for result.
    let result = await downloadPromise;
    let priceData;

    for (let i = 0; i < result.data.prices.length; i++) {
      setTimeout(async function timer() {
        priceData = result.data.prices[i].toString();
        let splitPrice = priceData.split(",", 2);
        console.log("prices: " + splitPrice[0] + "," + splitPrice[1]);
        // console.log("hello world");

        let product = {
          // productID: "1647302400000",
          cryptoTimestamp: splitPrice[0],
          // tweetTimestamp: splitPrice[0],
          currency: reqBody.currency,
          price: splitPrice[1]

        };


        // data = {
        //   statusCode: 200,
        //   body: data.body + JSON.stringify(product)
        // };


        let responce = await docClient
          .put({
            TableName: tableName,
            // TableName: tweetTable,
            Item: product,
          })
          .promise();

        // data = {
        //   statusCode: 200,
        //   body: data.body + JSON.stringify(responce)
        // };

      }, i * 30);
    }

    // result.data.prices.forEach(async (prices: any) => {
    //   let priceData = prices.toString();
    //   let splitPrice = priceData.split(",", 2);
    //   // console.log("prices: " + splitPrice[0] + "," + splitPrice[1]);
    //   // console.log("prices: " + prices);
    //   // let cryptoResult = createCrypto(event, "bitcoin", splitPrice[0], splitPrice[1]);
    //   // data = cryptoResult;
    //   // data =
    //   // {
    //   //   'statusCode': 200,
    //   //   'body': JSON.stringify({
    //   //     timestamp: splitPrice[0],
    //   //     price: splitPrice[1]
    //   //   })
    //   // }


    //   let product = {
    //     // productID: "1647302400000",
    //     productID: splitPrice[0],
    //     currency: "bitcoin",
    //     price: splitPrice[1]

    //   };


    //   data = {
    //     statusCode: 200,
    //     body: data.body + JSON.stringify(product)
    //   };


    //   await docClient
    //     .put({
    //       TableName: tableName,
    //       Item: product,
    //     })
    //     .promise();

    //   await sleep(10000);

    //   // setTimeout(() => {
    //   //   putData(product)
    //   // }, 1000);


    //   return new Promise((resolve, reject) => {

    //     setTimeout(() => {
    //       resolve(data);
    //     }, 1000);
    //   });


    //   //result = product;
    return reqBody;

    // })
  } catch (e) {
    return handleError(e);
  }


};

export const putData = async (data: any) => {

  await docClient
    .put({
      TableName: tableName,
      Item: data,
    })
    .promise();
  return data;
};

export const createcryptoDaily = async () => {

  let product = {
    statusCode: 200,
    body: JSON.stringify({
      timestamp: "sdf1",
      price: "sdfsdf12"
    })
  }

  return product;
};

export const createCryptoMonthly = async (event: APIGatewayProxyEvent, cryptoCurrency: any, timastamp: any, cryptoPrice: any): Promise<APIGatewayProxyResult> => {

  let result_data;
  try {


    let date = new Date().getTime()
    let month = date - 1645835825163;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1) //January is 0!
    var yyyy = today.getFullYear();



    // this.downloadData(date_y, 164753074826, 'bitcoin');

    // console.log("month" + month);

    // console.log("date:" + date);


    // var newDate = new Date(date.setMonth(date.getMonth() + 8));

    var init_date = new Date(2018, 0, 1);
    console.log("1:" + init_date);
    // var mar = new Date(2009, 4, 1);
    // console.log("2:" + mar);

    var start_date = "";
    var stop_date = mm + "-1-" + yyyy;
    console.log(stop_date);
    while (start_date != stop_date) {
      var newdate_date = init_date.setMonth(init_date.getMonth() + 1);
      var new_date = new Date(newdate_date);
      var sanitised_date = new_date.toLocaleString("en-US", { timeZoneName: "short" }).split(",", 2);
      var date_mon = sanitised_date[0].replace("/", "-").replace("/", "-");
      // var date_mon = date_mon.replace("/", "-");

      start_date = date_mon;
      //console.log("date_y:" + start_date);
      let result = await getCryptoDataMonthly(date_mon, 164753074826, 'bitcoin');



      const product = {
        // productID: "1647302400000",
        productID: new_date.toString(),
        currency: "bitcoin",
        price: result.data.market_data.current_price.usd

      };

      result_data = product;
      await docClient
        .put({
          TableName: tableName,
          Item: product,
        })
        .promise();



    }





  } catch (e) {
    return handleError(e);
  }

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(result_data),
  };
};

export const downloadData = async (event: APIGatewayProxyEvent, cryptoCurrency: string, timastamp: string, cryptoPrice: string): Promise<APIGatewayProxyResult> => {
  let result =
  {
    statusCode: 200,
    body: JSON.stringify({
      timestamp: "sdf1",
      price: "sdfsdf12"
    })
  }
  // try {

  //   let downloadPromise = createCryptoMonthly(event, 1644952184, 1643817363000, 'bitcoin');
  //   let result = await downloadPromise;


  //   return result;
  // }
  // catch (err) {
  //   //return handleError(err);
  // }


  // let response;
  // try {
  //   // const ret = await axios(url);
  //   response = {
  //     'statusCode': 200,
  //     'body': JSON.stringify({
  //       message: 'hello world',
  //       // location: ret.data.trim()
  //     })
  //   }
  // } catch (err) {
  //   console.log(err);
  //   return err;
  // }

  return result;


};

export const crypto = async (event: APIGatewayProxyEvent, cryptoCurrency: any, timastamp: any, cryptoPrice: any): Promise<APIGatewayProxyResult> => {

  let result = {
    statusCode: 200,
    body: JSON.stringify({
      timestamp: "sdf1",
      price: "sdfsdf12"
    })
  }

  try {

    let downloadPromise = createCryptoMonthly(event, 1644952184, 1643817363000, 'bitcoin');
    let result = await downloadPromise;


    return result;
  }
  catch (err) {
    return handleError(err);
  }


  let response;
  try {
    // const ret = await axios(url);
    response = {
      'statusCode': 200,
      'body': JSON.stringify({
        message: 'hello world',
        // location: ret.data.trim()
      })
    }
  } catch (err) {
    // return err;
  }


  return result;


}