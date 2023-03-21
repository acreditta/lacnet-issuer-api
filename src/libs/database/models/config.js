import { dynamoDocClient } from '../client.js';
import { 
  PutCommand,
  ScanCommand,
  GetCommand
} from "@aws-sdk/lib-dynamodb";
import { tableName } from "../migrations/configMigration.js";

export const put = (config) => {
  const putParams = {
    TableName: tableName,
    Item: {
      ...config,
      createdAt: new Date().toISOString(),
    },
  };
  
  const command = new PutCommand(putParams);
  
  return dynamoDocClient.send(command);
}

export const get = async () => {
  const getParams = {
      TableName: tableName,
  };
  const command = new ScanCommand(getParams);
  return await dynamoDocClient.send(command);
}

export const getOne = async (id, name) => {
  const getParams = {
      TableName: tableName,
      Key: {
        id: id,
        name: name,
      }
  };
  const command = new GetCommand(getParams);
  return await dynamoDocClient.send(command);
}
