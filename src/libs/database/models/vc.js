import { dynamoDocClient } from '../client.js';
import { 
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";
import { tableName } from "../migrations/vcMigration.js";

export const put = (credential) => {
  const putParams = {
    TableName: tableName,
    Item: {
      ...credential,
      createdAt: new Date().toISOString(),
    },
  };
  
  const command = new PutCommand(putParams);
  
  return dynamoDocClient.send(command);
}

export const get = async (issuerDid = null) => {
  const getParams = {
      TableName: tableName,
  };
  if (issuerDid) {
    getParams.FilterExpression = "issuerDid = :issuerDid";
    getParams.ExpressionAttributeValues = {
      ":issuerDid": issuerDid,
    };
  }
  const command = new ScanCommand(getParams);
  return await dynamoDocClient.send(command);
}

export const getOne = async (issuerDid, hash) => {
  const getParams = {
      TableName: tableName,
      Key: {
        issuerDid: issuerDid,
        hash: hash,
      }
  };
  const command = new GetCommand(getParams);
  return await dynamoDocClient.send(command);
}
