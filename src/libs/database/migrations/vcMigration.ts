import { dynamoDocClient, checkTableExists } from '../client';
import { CreateTableCommand, CreateTableInput } from "@aws-sdk/client-dynamodb";
import config from "../../../config";

export const tableName = config.tablesPrefix + 'vc';
export const createTable = async () => {
  if (await checkTableExists(tableName)) {
    console.log(`Table ${tableName} already exists`)
    return;
  }
  const usersTableParams: CreateTableInput = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'issuerDid', KeyType: 'HASH' },
      { AttributeName: 'hash', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'issuerDid', AttributeType: 'S' },
      { AttributeName: 'hash', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  const command = new CreateTableCommand(usersTableParams);

  dynamoDocClient.send(command).then((data) => {
    console.log(`Table ${tableName} created:`);
    console.log(data);
  }).catch((err) => {
    console.log(`Error creating table ${tableName}: ${err}`);
  }
  );
};