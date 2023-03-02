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
import { tableName } from "./../migrations/issuerMigration";

export const put = (user: any) => {
  const putParams: PutCommandInput = {
    TableName: tableName,
    Item: {
      ...user,
      createdAt: new Date().toISOString(),
    },
  };
  
  const command: PutCommand = new PutCommand(putParams);
  
  return dynamoDocClient.send(command);
}

export const get = async (id?: number) => {
  const getParams: ScanCommandInput = {
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

export const getOne = async (id:number, did: string) => {
  const getParams: GetCommandInput = {
      TableName: tableName,
      Key: {
        did: did,
        id: id,
      }
  };
  const command = new GetCommand(getParams);
  return await dynamoDocClient.send(command);
}

export const destroy = async (id:number, did: string) => {
  const deleteParams: DeleteCommandInput = {
      TableName: tableName,
      Key: {
        did: did,
        id: id,
      }
  };
  const command = new DeleteCommand(deleteParams);
  return await dynamoDocClient.send(command);
}
