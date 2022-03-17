const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = (function () {
  function DynamoDBClient({ tableName }) {
    this.tableName = tableName;
  }

  DynamoDBClient.prototype.post = async function (payload, rest = {}) {
    return await dynamo
      .put({
        TableName: this.tableName,
        Item: {
          id: uuid.v4(),
          ...payload,
        },
        ...rest,
      })
      .promise();
  };

  DynamoDBClient.prototype.put = async function (payload, rest = {}) {
    return await dynamo
      .update({
        TableName: this.tableName,
        Key: {
          ...payload,
        },
        ...rest,
      })
      .promise();
  };

  DynamoDBClient.prototype.delete = async function (payload, rest = {}) {
    return await dynamo
      .delete({
        TableName: this.tableName,
        Key: {
          ...payload,
        },
        ...rest,
      })
      .promise();
  };

  DynamoDBClient.prototype.get = async function (payload, rest = {}) {
    return await dynamo
      .get({
        TableName: this.tableName,
        Key: {
          ...payload,
        },
        ...rest,
      })
      .promise();
  };

  return DynamoDBClient;
})();
