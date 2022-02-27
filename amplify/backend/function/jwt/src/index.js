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

function generateClaims(userId, salt, expiresInSeconds) {
  const now = new Date().getTime();

  return {
    sub: encryptUserId(userId, salt),
    iat: now,
    exp: now + expiresInSeconds * 1000,
  };
}

exports.handler = async (event) => {
  const { userId } = JSON.parse(event.body);

  const accessTokenSalt = generateSalt();
  const accessTokenClaims = generateClaims(userId, accessTokenSalt, ACCESS_TOKEN_EXPIRES_IN_SECONDS);
  const accessToken = jsonwebtoken.sign(accessTokenClaims, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  });

  const refreshTokenSalt = generateSalt();
  const refreshTokenClaims = generateClaims(userId, refreshTokenSalt, REFRESH_TOKEN_EXPIRES_IN_SECONDS);
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
