import config from "../../config/index.js";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: config.awsRegion });

export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

export const checkTableExists = async (tableName) => {
    try {
        const tables = await dynamoClient.send(new ListTablesCommand({}));
        return tables.TableNames?.includes(tableName);
    } catch (err) {
        return false;
    }
}