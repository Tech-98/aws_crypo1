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
//Module that reads keys from .env file
var dotenv = require('dotenv');
var axios = require('axios');
// import { DataDownloader } from './demo_2.js';
//Node Twitter library
var Twitter = require('twitter');
//Copy variables in file into environment variables
dotenv.config({ path: '.env' });
//Set up the Twitter client with the credentials
// let client = new Twitter({
//     consumer_key: process.env.CONSUMER_KEY,
//     consumer_secret: process.env.CONSUMER_SECRET,
//     access_token_key: process.env.ACCESS_TOKEN_KEY,
//     access_token_secret: process.env.ACCESS_TOKEN_SECRET
// });
var client = new Twitter({
    consumer_key: 'gRKCeB7qae5MWRgqsKtK3OydY',
    consumer_secret: 'hoWByZlKlNrutPnlGc3WtYZ8nlflwQHgEVxV1ZwQ1jhrI0qpe2',
    access_token_key: '1501145985451499520-43zRJboUP9aGwQGzi9AIvGm3yduhU2',
    access_token_secret: '2dTtMDmVNgyv58ICvRBhjghB1IG1fHn7PlLebA2QYvElZ'
});
//Downloads and outputs tweet text
function searchTweets() {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    searchParams = {
                        q: "bitcoin",
                        count: 100000,
                        lang: "en",
                        // until: '2022-03-01'
                        since: "2022-03-08",
                        until: "2022-03-23"
                    };
                    return [4 /*yield*/, client.get('search/tweets', searchParams)];
                case 1:
                    result = _a.sent();
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
                    return [2 /*return*/, result];
                case 2:
                    error_1 = _a.sent();
                    console.log(JSON.stringify(error_1));
                    console.log("error");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
;
//Call function to search for tweets with specified subject
searchTweets();
