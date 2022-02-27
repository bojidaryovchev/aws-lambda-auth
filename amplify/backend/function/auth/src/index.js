const process = require('process');

// 

exports.handler = async (event) => {
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
    }),
  };
  return response;
};
