var http = require('http'),
    httpProxy = require('http-proxy');

var options = {
  router: {
    'amduonglich.mininoic.com': '127.0.0.1:5000'
  }
}

var proxyServer = httpProxy.createServer(options);
proxyServer.listen(8080);