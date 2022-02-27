function HttpResponse({ statusCode, headers, body }) {
  this.statusCode = statusCode;
  this.headers = headers;
  this.body = body;
}

HttpResponse.prototype.toString = function () {
  return JSON.stringify(this);
};

module.exports = HttpResponse;
