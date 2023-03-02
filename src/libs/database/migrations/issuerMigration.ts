import { dynamoDocClient } from '../client';
import { CreateTableCommand, CreateTableInput } from "@aws-sdk/client-dynamodb";
import config from "../../../config";

export const tableName = config.tablesPrefix + 'issuers';
export const createTable = async () => {
  const usersTableParams: CreateTableInput = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
      { AttributeName: 'did', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'N' },
      { AttributeName: 'did', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  const command = new CreateTableCommand(usersTableParams);

  dynamoDocClient.send(command).then((data) => {
    console.log(data);
  }).catch((err) => {
    console.log(err);
  }
  );
};