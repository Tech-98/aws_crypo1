/* Stores data in the database */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// import { Comprehend } from "aws-sdk";
var AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
// import CoinGecko = require('coingecko-api');
// "include": ["./node_modules/coingecko-api/lib/CoinGecko.js"]
// import * as CoinGecko from "./node_modules/coingecko-api/lib/CoinGecko.js";
var CoinGecko = require('coingecko-api');
var CoinGeckoClient = new CoinGecko();
var DBInterface = /** @class */ (function () {
    function DBInterface(username, password) {
        this.username = username;
        this.password = password;
    }
    DBInterface.prototype.connect = function () {
        //Put database connection code here
    };
    DBInterface.prototype.close = function () {
        //Close database connection here
    };
    DBInterface.prototype.storeData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve("Data stored: " + JSON.stringify(data));
                        }, 1000);
                    })];
            });
        });
    };
    return DBInterface;
}());
/* Downloads data from web service */
var DataDownloader = /** @class */ (function () {
    function DataDownloader(url) {
        this.url = url;
    }
    DataDownloader.prototype.getDataFromWebService = function (start_date, end_date, currency) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoinGeckoClient.coins.fetchHistory(currency, {
                            date: start_date
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    DataDownloader.prototype.getDataDaily = function (start_date, end_date, currency) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoinGeckoClient.coins.fetchMarketChartRange(currency, {
                            from: start_date,
                            to: end_date
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    return DataDownloader;
}());
/* Contains the main logic of the application */
var Main = /** @class */ (function () {
    //sleep;
    function Main() {
        //Create instances of classes
        this.dbInterface = new DBInterface("root", "123");
        this.dataDownloader = new DataDownloader("www.example.com/api");
    }
    Main.prototype.sleep = function (millis) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, millis); })];
            });
        });
    };
    Main.prototype.downloadData = function (start_date, end_date, currency) {
        return __awaiter(this, void 0, void 0, function () {
            var downloadPromise, result_1, priceData_1, _loop_1, i, err_1, st;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.dbInterface.connect();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        downloadPromise = this.dataDownloader.getDataDaily(start_date, end_date, currency);
                        return [4 /*yield*/, downloadPromise];
                    case 2:
                        result_1 = _a.sent();
                        priceData_1 = "";
                        _loop_1 = function (i) {
                            setTimeout(function timer() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var splitPrice;
                                    return __generator(this, function (_a) {
                                        priceData_1 = result_1.data.prices[i].toString();
                                        splitPrice = priceData_1.split(",", 2);
                                        console.log("prices: " + splitPrice[0] + "," + splitPrice[1]);
                                        return [2 /*return*/];
                                    });
                                });
                            }, i * 30);
                        };
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
                        for (i = 0; i < result_1.data.prices.length; i++) {
                            _loop_1(i);
                        }
                        // //Pass data to database to store
                        // let storeDataPromise = this.dbInterface.storeData(data);
                        //  console.log("data" + result.success);
                        // let result = await storeDataPromise;
                        // console.log("Result: " + result);
                        // result.data.forEach((tweet)=>{
                        //     console.log("Tweet id: " + tweet.id + ". Tweet text: " + tweet.text);
                        // });
                        return [2 /*return*/, result_1];
                    case 3:
                        err_1 = _a.sent();
                        console.error("Error occurred: " + err_1);
                        return [3 /*break*/, 5];
                    case 4:
                        this.dbInterface.close();
                        st = void 0;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.downloadDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var date, month, today, dd, mm, yyyy, init_date, start_date, stop_date, eightMonthsFromJan312009, new_date, sanitised_date, date_mon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        date = new Date().getTime();
                        month = date - 1645835825163;
                        today = new Date();
                        dd = String(today.getDate()).padStart(2, '0');
                        mm = String(today.getMonth() + 1) //January is 0!
                        ;
                        yyyy = today.getFullYear();
                        init_date = new Date(2018, 0, 1);
                        console.log("1:" + init_date);
                        start_date = "";
                        stop_date = mm + "-1-" + yyyy;
                        console.log(stop_date);
                        _a.label = 1;
                    case 1:
                        if (!(start_date != stop_date)) return [3 /*break*/, 3];
                        eightMonthsFromJan312009 = init_date.setMonth(init_date.getMonth() + 1);
                        new_date = new Date(eightMonthsFromJan312009);
                        sanitised_date = new_date.toLocaleString("en-US", { timeZoneName: "short" }).split(",", 2);
                        date_mon = sanitised_date[0].replace("/", "-").replace("/", "-");
                        // var date_mon = date_mon.replace("/", "-");
                        start_date = date_mon;
                        // console.log("date_y:" + start_date);
                        return [4 /*yield*/, this.downloadData(date_mon, 164753074826, 'bitcoin')];
                    case 2:
                        // console.log("date_y:" + start_date);
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.analysis = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var Comprehend, params, result, sent, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Comprehend = new AWS.Comprehend();
                        params = {
                            LanguageCode: 'en',
                            Text: text
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Comprehend.detectSentiment(params).promise()];
                    case 2:
                        result = _a.sent();
                        sent = {
                            statusCode: 201,
                            body: JSON.stringify(result.Sentiment)
                        };
                        // console.log(JSON.stringify(result.Sentiment));
                        console.log(JSON.stringify(sent.body));
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.createCryp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var product;
            return __generator(this, function (_a) {
                product = {
                    statusCode: 200,
                    body: JSON.stringify({
                        timestamp: "sdf1",
                        price: "sdfsdf12"
                    })
                };
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
                return [2 /*return*/, product];
            });
        });
    };
    ;
    return Main;
}());
var main = new Main();
// main.createCryp();
main.analysis("RT @JakobGerdts: @AndyD_Bitcoin_M Let’s gooooo!!!! 💪💪🙌 https://t.co/kgyX6IuP4y");
