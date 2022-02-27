const process = require('process');
const jsonwebtoken = require('jsonwebtoken');
const crypto = require('crypto');

const HttpOkResponse = require('/opt/httpOkResponse');

/**
 * accessToken expires in 15 minutes
 * refreshToken expires in 7 days
 *
 * we generate a refreshToken upon accessToken generation
 * and then regenerate the refreshToken upon accessToken regeneration (refreshToken rotation)
 *
 * we save refresh tokens in our database and delete them from it upon regeneration
 *
 * both tokens have the encrypted userId as a sub claim
 * both tokens are signed using a different secret
 */

// 15 minutes * 60 seconds
const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 15 * 60;
// 7 days * 24 hours * 60 minutes * 60 seconds
const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

function generateSalt() {
  return crypto.randomBytes(128).toString('base64');
}

function encryptUserId(userId, salt) {
  return crypto.createHmac('sha256', salt).update(userId).digest('hex');
}

function generateClaims(userId, salt) {
  // add more JWT claims here..
  return {
    sub: encryptUserId(userId, salt),
  };
}

exports.handler = async (event) => {
  const { userId } = JSON.parse(event.body);

  // the accessToken is not preserved anywhere, use the accessToken salt to encrypt the userId
  const accessTokenClaims = generateClaims(userId, process.env.JWT_ACCESS_TOKEN_SALT);
  const accessToken = jsonwebtoken.sign(accessTokenClaims, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  });

  // the refresh token gets preserved in the database, generate new salt each time
  const refreshTokenSalt = generateSalt();
  const refreshTokenClaims = generateClaims(userId, refreshTokenSalt);
  const refreshToken = jsonwebtoken.sign(refreshTokenClaims, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN_SECONDS,
  });

  return new HttpOkResponse({
    // Uncomment below to enable CORS requests
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Headers': '*',
    // },
    body: JSON.stringify({
      accessToken,
      refreshToken,
    }),
  });
};
