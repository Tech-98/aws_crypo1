"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
exports.crypto = exports.downloadData = exports.createCryptoMonthly = exports.createcryptoDaily = exports.putData = exports.createCrypto = exports.getCryptoDataMonthly = exports.getCryptoData = exports.listProduct = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.searchTweets = exports.createProduct = void 0;
var aws_sdk_1 = require("aws-sdk");
var uuid_1 = require("uuid");
var yup = require("yup");
var twitter_1 = require("twitter");
//Copy variables in file into environment variables
//Set up the Twitter client with the credentials
// let client = new Twitter({
//     consumer_key: process.env.CONSUMER_KEY,
//     consumer_secret: process.env.CONSUMER_SECRET,
//     access_token_key: process.env.ACCESS_TOKEN_KEY,
//     access_token_secret: process.env.ACCESS_TOKEN_SECRET
// });
var client = new twitter_1["default"]({
    consumer_key: 'gRKCeB7qae5MWRgqsKtK3OydY',
    consumer_secret: 'hoWByZlKlNrutPnlGc3WtYZ8nlflwQHgEVxV1ZwQ1jhrI0qpe2',
    access_token_key: '1501145985451499520-43zRJboUP9aGwQGzi9AIvGm3yduhU2',
    access_token_secret: '2dTtMDmVNgyv58ICvRBhjghB1IG1fHn7PlLebA2QYvElZ'
});
var CoinGecko = require('coingecko-api');
var CoinGeckoClient = new CoinGecko();
var docClient = new aws_sdk_1["default"].DynamoDB.DocumentClient();
// const tableName = "ProductsTable";
var tableName = "cryptoData";
var tweetTable = "tweet";
var headers = {
    "content-type": "application/json"
};
var schema = yup.object().shape({
    currency: yup.string().required(),
    start: yup.number().required(),
    end: yup.number().required()
});
var createProduct = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var reqBody, product, putResult, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                reqBody = JSON.parse(event.body);
                product = __assign(__assign({}, reqBody), { productID: (0, uuid_1.v4)() });
                return [4 /*yield*/, docClient
                        .put({
                        TableName: tableName,
                        Item: product
                    })
                        .promise()];
            case 1:
                putResult = _a.sent();
                return [2 /*return*/, {
                        statusCode: 201,
                        headers: headers,
                        body: JSON.stringify(putResult)
                    }];
            case 2:
                e_1 = _a.sent();
                return [2 /*return*/, handleError(e_1)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createProduct = createProduct;
var searchTweets = function () { return __awaiter(void 0, void 0, void 0, function () {
    var product_1, productRes_1, searchParams, result_1, _loop_1, i, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                product_1 = {
                    statusCode: 201,
                    headers: headers,
                    body: JSON.stringify({ "message": "created" })
                };
                productRes_1 = {
                    statusCode: 201,
                    headers: headers,
                    body: JSON.stringify({})
                };
                searchParams = {
                    // q: reqBody.search,
                    q: "mkr",
                    count: 100000,
                    lang: "en",
                    // until: '2022-03-01'
                    since: "2022-03-08",
                    until: "2022-03-23"
                };
                return [4 /*yield*/, client.get('search/tweets', searchParams)];
            case 1:
                result_1 = _a.sent();
                _loop_1 = function (i) {
                    setTimeout(function timer() {
                        return __awaiter(this, void 0, void 0, function () {
                            var tweetDate, tweets, putResult;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        //     console.log("Tweet id: " + tweet.created_at + ". Tweet text: " + tweet.text);
                                        // console.log("----Tweet id: " + Date.parse(tweet.created_at) / 1000 + " -----. Tweet text: " + tweet.text);
                                        product_1 = {
                                            statusCode: 201,
                                            headers: headers,
                                            body: product_1.body + JSON.stringify({
                                                date: Date.parse(result_1.statuses[i].created_at) / 1000,
                                                text: result_1.statuses[i].text,
                                                currency: "litecoin"
                                            })
                                        };
                                        tweetDate = Date.parse(result_1.statuses[i].created_at) / 1000;
                                        tweets = {
                                            tweetTimestamp: tweetDate.toString(),
                                            currency: "maker",
                                            text: result_1.statuses[i].text
                                        };
                                        return [4 /*yield*/, docClient
                                                .put({
                                                TableName: "tweet",
                                                Item: tweets
                                            })
                                                .promise()];
                                    case 1:
                                        putResult = _a.sent();
                                        productRes_1 = {
                                            statusCode: 201,
                                            headers: headers,
                                            body: productRes_1.body + JSON.stringify({
                                                date: putResult
                                            })
                                        };
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }, i * 300);
                };
                for (i = 0; i < result_1.statuses.length; i++) {
                    _loop_1(i);
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
                return [2 /*return*/, product_1];
            case 2:
                e_2 = _a.sent();
                return [2 /*return*/, handleError(e_2)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.searchTweets = searchTweets;
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError(statusCode, body) {
        if (body === void 0) { body = {}; }
        var _this = _super.call(this, JSON.stringify(body)) || this;
        _this.statusCode = statusCode;
        return _this;
    }
    return HttpError;
}(Error));
var fetchProductById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, docClient
                    .get({
                    TableName: tableName,
                    Key: {
                        productID: id
                    }
                })
                    .promise()];
            case 1:
                output = _a.sent();
                if (!output.Item) {
                    throw new HttpError(404, { error: "not found" });
                }
                return [2 /*return*/, output.Item];
        }
    });
}); };
var handleError = function (e) {
    if (e instanceof yup.ValidationError) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({
                errors: e.errors
            })
        };
    }
    if (e instanceof SyntaxError) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ error: "invalid request body format : \"".concat(e.message, "\"") })
        };
    }
    if (e instanceof HttpError) {
        return {
            statusCode: e.statusCode,
            headers: headers,
            body: e.message
        };
    }
    throw e;
};
var getProduct = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var product, e_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetchProductById((_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                product = _b.sent();
                return [2 /*return*/, {
                        statusCode: 200,
                        headers: headers,
                        body: JSON.stringify(product)
                    }];
            case 2:
                e_3 = _b.sent();
                return [2 /*return*/, handleError(e_3)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProduct = getProduct;
var updateProduct = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var id, reqBody, product, e_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, fetchProductById(id)];
            case 1:
                _b.sent();
                reqBody = JSON.parse(event.body);
                return [4 /*yield*/, schema.validate(reqBody, { abortEarly: false })];
            case 2:
                _b.sent();
                product = __assign(__assign({}, reqBody), { productID: id });
                return [4 /*yield*/, docClient
                        .put({
                        TableName: tableName,
                        Item: product
                    })
                        .promise()];
            case 3:
                _b.sent();
                return [2 /*return*/, {
                        statusCode: 200,
                        headers: headers,
                        body: JSON.stringify(product)
                    }];
            case 4:
                e_4 = _b.sent();
                return [2 /*return*/, handleError(e_4)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateProduct = updateProduct;
var deleteProduct = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var id, e_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, fetchProductById(id)];
            case 1:
                _b.sent();
                return [4 /*yield*/, docClient["delete"]({
                        TableName: tableName,
                        Key: {
                            productID: id
                        }
                    })
                        .promise()];
            case 2:
                _b.sent();
                return [2 /*return*/, {
                        statusCode: 204,
                        body: ""
                    }];
            case 3:
                e_5 = _b.sent();
                return [2 /*return*/, handleError(e_5)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteProduct = deleteProduct;
var listProduct = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, docClient
                    .scan({
                    TableName: tableName
                })
                    .promise()];
            case 1:
                output = _a.sent();
                return [2 /*return*/, {
                        statusCode: 200,
                        headers: headers,
                        body: JSON.stringify(output.Items)
                    }];
        }
    });
}); };
exports.listProduct = listProduct;
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
var getCryptoData = function (start_date, end_date, currency) { return __awaiter(void 0, void 0, void 0, function () {
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
}); };
exports.getCryptoData = getCryptoData;
var getCryptoDataMonthly = function (start_date, end_date, currency) { return __awaiter(void 0, void 0, void 0, function () {
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
}); };
exports.getCryptoDataMonthly = getCryptoDataMonthly;
// , start_date: any, end_date: any, currency: string
function sleep(millis) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, millis); })];
        });
    });
}
var createCrypto = function (event, cryptoCurrency, timastamp, cryptoPrice) { return __awaiter(void 0, void 0, void 0, function () {
    var reqBody_1, downloadPromise, result_2, priceData_1, _loop_2, i, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                reqBody_1 = JSON.parse(event.body);
                // let data;
                return [4 /*yield*/, schema.validate(reqBody_1, { abortEarly: false })];
            case 1:
                // let data;
                _a.sent();
                downloadPromise = (0, exports.getCryptoData)(reqBody_1.start, reqBody_1.end, reqBody_1.currency);
                return [4 /*yield*/, downloadPromise];
            case 2:
                result_2 = _a.sent();
                _loop_2 = function (i) {
                    setTimeout(function timer() {
                        return __awaiter(this, void 0, void 0, function () {
                            var splitPrice, product, responce;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        priceData_1 = result_2.data.prices[i].toString();
                                        splitPrice = priceData_1.split(",", 2);
                                        console.log("prices: " + splitPrice[0] + "," + splitPrice[1]);
                                        product = {
                                            // productID: "1647302400000",
                                            cryptoTimestamp: splitPrice[0],
                                            // tweetTimestamp: splitPrice[0],
                                            currency: reqBody_1.currency,
                                            price: splitPrice[1]
                                        };
                                        return [4 /*yield*/, docClient
                                                .put({
                                                TableName: tableName,
                                                // TableName: tweetTable,
                                                Item: product
                                            })
                                                .promise()];
                                    case 1:
                                        responce = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }, i * 30);
                };
                for (i = 0; i < result_2.data.prices.length; i++) {
                    _loop_2(i);
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
                return [2 /*return*/, reqBody_1];
            case 3:
                e_6 = _a.sent();
                return [2 /*return*/, handleError(e_6)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createCrypto = createCrypto;
var putData = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, docClient
                    .put({
                    TableName: tableName,
                    Item: data
                })
                    .promise()];
            case 1:
                _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.putData = putData;
var createcryptoDaily = function () { return __awaiter(void 0, void 0, void 0, function () {
    var product;
    return __generator(this, function (_a) {
        product = {
            statusCode: 200,
            body: JSON.stringify({
                timestamp: "sdf1",
                price: "sdfsdf12"
            })
        };
        return [2 /*return*/, product];
    });
}); };
exports.createcryptoDaily = createcryptoDaily;
var createCryptoMonthly = function (event, cryptoCurrency, timastamp, cryptoPrice) { return __awaiter(void 0, void 0, void 0, function () {
    var result_data, date, month, today, dd, mm, yyyy, init_date, start_date, stop_date, newdate_date, new_date, sanitised_date, date_mon, result, product, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
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
                if (!(start_date != stop_date)) return [3 /*break*/, 4];
                newdate_date = init_date.setMonth(init_date.getMonth() + 1);
                new_date = new Date(newdate_date);
                sanitised_date = new_date.toLocaleString("en-US", { timeZoneName: "short" }).split(",", 2);
                date_mon = sanitised_date[0].replace("/", "-").replace("/", "-");
                // var date_mon = date_mon.replace("/", "-");
                start_date = date_mon;
                return [4 /*yield*/, (0, exports.getCryptoDataMonthly)(date_mon, 164753074826, 'bitcoin')];
            case 2:
                result = _a.sent();
                product = {
                    // productID: "1647302400000",
                    productID: new_date.toString(),
                    currency: "bitcoin",
                    price: result.data.market_data.current_price.usd
                };
                result_data = product;
                return [4 /*yield*/, docClient
                        .put({
                        TableName: tableName,
                        Item: product
                    })
                        .promise()];
            case 3:
                _a.sent();
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 6];
            case 5:
                e_7 = _a.sent();
                return [2 /*return*/, handleError(e_7)];
            case 6: return [2 /*return*/, {
                    statusCode: 201,
                    headers: headers,
                    body: JSON.stringify(result_data)
                }];
        }
    });
}); };
exports.createCryptoMonthly = createCryptoMonthly;
var downloadData = function (event, cryptoCurrency, timastamp, cryptoPrice) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        result = {
            statusCode: 200,
            body: JSON.stringify({
                timestamp: "sdf1",
                price: "sdfsdf12"
            })
        };
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
        return [2 /*return*/, result];
    });
}); };
exports.downloadData = downloadData;
var crypto = function (event, cryptoCurrency, timastamp, cryptoPrice) { return __awaiter(void 0, void 0, void 0, function () {
    var result, downloadPromise, result_3, err_1, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = {
                    statusCode: 200,
                    body: JSON.stringify({
                        timestamp: "sdf1",
                        price: "sdfsdf12"
                    })
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                downloadPromise = (0, exports.createCryptoMonthly)(event, 1644952184, 1643817363000, 'bitcoin');
                return [4 /*yield*/, downloadPromise];
            case 2:
                result_3 = _a.sent();
                return [2 /*return*/, result_3];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, handleError(err_1)];
            case 4:
                try {
                    // const ret = await axios(url);
                    response = {
                        'statusCode': 200,
                        'body': JSON.stringify({
                            message: 'hello world'
                        })
                    };
                }
                catch (err) {
                    // return err;
                }
                return [2 /*return*/, result];
        }
    });
}); };
exports.crypto = crypto;
