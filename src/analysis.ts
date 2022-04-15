
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { crypto } from "./handlers";
import AWS from "aws-sdk";
AWS.config.update({ region: 'us-east-1' });


export const analyse = async (text: string): Promise<APIGatewayProxyResult> => {

    let Comprehend = new AWS.Comprehend();
    const params = {
        LanguageCode: 'en',
        Text: text
    };

    try {
        const result = await Comprehend.detectSentiment(params).promise();
        console.log(result.Sentiment);
        return {
            statusCode: 201,
            body: JSON.stringify(result.Sentiment)
        };
    } catch (e) {
        console.log(e);
        return handleError(e);
    }


}


function handleError(e: unknown): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
    throw new Error("Function not implemented:" + e);
}
