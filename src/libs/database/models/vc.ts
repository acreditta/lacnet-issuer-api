import { dynamoDocClient } from '../client';
import { 
  PutCommand, 
  PutCommandInput, 
  ScanCommand, 
  ScanCommandInput, 
  GetCommand, 
  GetCommandInput,
  DeleteCommand,
  DeleteCommandInput
} from "@aws-sdk/lib-dynamodb";
import { tableName } from "./../migrations/vcMigration";

export const put = (credential: any) => {
  const putParams: PutCommandInput = {
    TableName: tableName,
    Item: {
      ...credential,
      createdAt: new Date().toISOString(),
    },
  };
  
  const command: PutCommand = new PutCommand(putParams);
  
  return dynamoDocClient.send(command);
}

export const get = async (issuerDid?: string) => {
  const getParams: ScanCommandInput = {
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

export const getOne = async (issuerDid:string, hash: string) => {
  const getParams: GetCommandInput = {
      TableName: tableName,
      Key: {
        issuerDid: issuerDid,
        hash: hash,
      }
  };
  const command = new GetCommand(getParams);
  return await dynamoDocClient.send(command);
}
