import config from "../../config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: config.awsRegion });

export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);