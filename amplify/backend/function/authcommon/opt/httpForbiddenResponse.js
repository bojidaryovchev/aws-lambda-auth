const HttpResponse = require('./httpResponse');

function HttpForbiddenResponse({ headers, body }) {
  HttpResponse.call(this, {
    statusCode: 403,
    headers,
    body,
  });
}

HttpForbiddenResponse.prototype = Object.create(HttpResponse.prototype);

module.exports = HttpForbiddenResponse;
