import { dynamoDocClient } from '../client.js';
import { 
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";
import { tableName } from "../migrations/issuerMigration.js";

export const put = (user) => {
  const putParams = {
    TableName: tableName,
    Item: {
      ...user,
      createdAt: new Date().toISOString(),
    },
  };
  
  const command = new PutCommand(putParams);
  
  return dynamoDocClient.send(command);
}

export const get = async (id = null) => {
  const getParams = {
      TableName: tableName,
  };
  if (id) {
    getParams.FilterExpression = "id = :id";
    getParams.ExpressionAttributeValues = {
      ":id": id,
    };
  }
  const command = new ScanCommand(getParams);
  return await dynamoDocClient.send(command);
}

export const getOne = async (id, did) => {
  const getParams = {
      TableName: tableName,
      Key: {
        did: did,
        id: id,
      }
  };
  const command = new GetCommand(getParams);
  return await dynamoDocClient.send(command);
}

export const destroy = async (id, did) => {
  const deleteParams = {
      TableName: tableName,
      Key: {
        did: did,
        id: id,
      }
  };
  const command = new DeleteCommand(deleteParams);
  return await dynamoDocClient.send(command);
}
