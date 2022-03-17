const process = require('process');
const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  await dynamo
    .put({
      TableName: 'users',
      Item: {
        id: uuid.v4(),
        email: 'email@provider.ext',
      },
    })
    .promise();

  // TODO implement
  const response = {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    body: JSON.stringify({
      event: JSON.stringify(event),
      jwtSecret: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      something: 'Dark Side',
    }),
  };
  return response;
};
