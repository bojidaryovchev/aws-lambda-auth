const HttpResponse = require('./httpResponse');

function HttpOkResponse({ headers, body }) {
  HttpResponse.call(this, {
    statusCode: 200,
    headers,
    body,
  });
}

HttpOkResponse.prototype = Object.create(HttpResponse.prototype);

module.exports = HttpOkResponse;
