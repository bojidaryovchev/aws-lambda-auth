const process = require('process');
const DynamoDBClient = require('/opt/dynamoDBClient');
const dynamoDBClient = new DynamoDBClient({
  tableName: 'users',
});

exports.handler = async (event) => {
  await dynamoDBClient.post({
    email: 'admin@gmail.com',
  });

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
