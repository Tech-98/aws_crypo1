/* Stores data in the database */

// import { Comprehend } from "aws-sdk";
let AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });

// import CoinGecko = require('coingecko-api');
// "include": ["./node_modules/coingecko-api/lib/CoinGecko.js"]
// import * as CoinGecko from "./node_modules/coingecko-api/lib/CoinGecko.js";
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

class DBInterface {
    //Authentication for database
    username;
    password;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    connect() {
        //Put database connection code here
    }

    close() {
        //Close database connection here
    }

    async storeData(data: any) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {//Dummy asynchronous function
                resolve("Data stored: " + JSON.stringify(data));
            }, 1000);
        });
    }
}

/* Downloads data from web service */
class DataDownloader {
    url;

    constructor(url: string) {
        this.url = url;
    }

    async getDataFromWebService(start_date: any, end_date: any, currency: any) {

        //let data = await CoinGeckoClient.global();
        // let data = await CoinGeckoClient.coins.fetchMarketChartRange(currency, {
        //     from: start_date,
        //     to: end_date,
        // });
        let data = await CoinGeckoClient.coins.fetchHistory(currency, {
            date: start_date
        });
        return data;
        // return new Promise((resolve, reject) => {

        //     setTimeout( () => {
        //         resolve(data);
        //     }, 500);
        // });
    }

    async getDataDaily(start_date: any, end_date: any, currency: any) {

        //let data = await CoinGeckoClient.global();
        // let data = await CoinGeckoClient.coins.fetchMarketChartRange(currency, {
        //     from: start_date,
        //     to: end_date,
        // });
        let data = await CoinGeckoClient.coins.fetchMarketChartRange(currency, {
            from: start_date,
            to: end_date,
        });
        return data;
        // return new Promise((resolve, reject) => {

        //     setTimeout( () => {
        //         resolve(data);
        //     }, 500);
        // });
    }
}

/* Contains the main logic of the application */
class Main {



    dbInterface;
    dataDownloader;
    //sleep;

    constructor() {
        //Create instances of classes
        this.dbInterface = new DBInterface("root", "123");
        this.dataDownloader = new DataDownloader("www.example.com/api");

    }

    async sleep(millis: number | undefined) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }

    async downloadData(start_date: string, end_date: number, currency: string) {
        this.dbInterface.connect();
        try {
            //Get promise to download data
            let downloadPromise = this.dataDownloader.getDataDaily(start_date, end_date, currency);

            //Execute promise and wait for result.
            let result = await downloadPromise;
            let priceData = "";

            //## let result = JSON.parse(data);
            // console.log("Data downloaded: " + JSON.stringify(result));
            // console.log("\033c");
            // console.log("price:" + result.prices);
            // console.log(result)
            // // var lines = process.stdout.getWindowSize()[1];


            // // console.log("price:" + result.data.market_data.current_price.usd)
            // for (var i = 0; i < 100; i++) {
            //     console.log('\r\n');
            // }
            // result.data.prices.forEach(async (prices) => {

            //     // if (true) {
            //     // await this.sleep(1000);
            //     // priceData = prices.toString();
            //     // let splitPrice = priceData.split(",", 2);
            //     // console.log("prices: " + splitPrice[0] + "," + splitPrice[1]);
            //     // for (let j = 0; j < 10; j++) { // 1
            //     //     console.log("sleep")
            //     //     if (j == 0) { // 2
            //     //         // await this.sleep(10000);
            //     //     }
            //     // }
            //     setTimeout(function timer() {
            //         priceData = prices.toString();
            //         let splitPrice = priceData.split(",", 2);
            //         console.log("prices: " + splitPrice[0] + "," + splitPrice[1]);
            //     }, 3000);
            // });

            for (let i = 0; i < result.data.prices.length; i++) {
                setTimeout(async function timer() {
                    priceData = result.data.prices[i].toString();
                    let splitPrice = priceData.split(",", 2);
                    console.log("prices: " + splitPrice[0] + "," + splitPrice[1]);
                    // console.log("hello world");
                }, i * 30);
            }




            // //Pass data to database to store
            // let storeDataPromise = this.dbInterface.storeData(data);

            //  console.log("data" + result.success);
            // let result = await storeDataPromise;
            // console.log("Result: " + result);
            // result.data.forEach((tweet)=>{
            //     console.log("Tweet id: " + tweet.id + ". Tweet text: " + tweet.text);
            // });
            return result;
        }
        catch (err) {
            console.error("Error occurred: " + err);
        }
        finally {
            this.dbInterface.close();
            let st
        }
    }

    async downloadDate() {


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
            var eightMonthsFromJan312009 = init_date.setMonth(init_date.getMonth() + 1);
            var new_date = new Date(eightMonthsFromJan312009);
            var sanitised_date = new_date.toLocaleString("en-US", { timeZoneName: "short" }).split(",", 2);
            var date_mon = sanitised_date[0].replace("/", "-").replace("/", "-");
            // var date_mon = date_mon.replace("/", "-");

            start_date = date_mon;
            // console.log("date_y:" + start_date);
            await this.downloadData(date_mon, 164753074826, 'bitcoin');


        }



    }


    async analysis(text: string) {
        let Comprehend = new AWS.Comprehend();
        const params = {
            LanguageCode: 'en',
            Text: text
        };

        try {
            const result = await Comprehend.detectSentiment(params).promise();
            let sent = {
                statusCode: 201,
                body: JSON.stringify(result.Sentiment)
            };
            // console.log(JSON.stringify(result.Sentiment));
            console.log(JSON.stringify(sent.body));
        } catch (e) {
            console.log(e);
        }

    }
    async createCryp() {

        let product = {
            statusCode: 200,
            body: JSON.stringify({
                timestamp: "sdf1",
                price: "sdfsdf12"
            })
        }

        // try {
        //   // const product = await fetchProductById(event.pathParameters?.id as string);

        //   return {
        //     statusCode: 200,
        //     headers,
        //     body: JSON.stringify(product),
        //   };
        // } catch (e) {
        //   return handleError(e);
        // }

        console.log(product);
        return product;

    };

}

let main = new Main();
// main.createCryp();
main.analysis("RT @JakobGerdts: @AndyD_Bitcoin_M Let’s gooooo!!!! 💪💪🙌 https://t.co/kgyX6IuP4y");
