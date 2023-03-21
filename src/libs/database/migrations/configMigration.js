import { dynamoDocClient, checkTableExists } from '../client.js';
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import config from "../../../config/index.js";

export const tableName = config.tablesPrefix + 'config';
export const createTable = async () => {
  if (await checkTableExists(tableName)) {
    console.log(`Table ${tableName} already exists`)
    return;
  }
  const usersTableParams = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
      { AttributeName: 'name', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'name', AttributeType: 'S' },
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