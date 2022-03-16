const HttpResponse = require('./httpResponse');

function HttpUnauthorizedResponse({ headers, body }) {
  HttpResponse.call(this, {
    statusCode: 401,
    headers,
    body,
  });
}

HttpUnauthorizedResponse.prototype = Object.create(HttpResponse.prototype);

module.exports = HttpUnauthorizedResponse;
