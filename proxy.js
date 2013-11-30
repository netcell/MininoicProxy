var http = require('http'),
    httpProxy = require('http-proxy');

var options = {
  router: {
    'amduonglich.mininoic.com': '127.0.0.1:5000',
    'mininoic.com': '127.0.0.1:8000'
  }
}

var proxyServer = httpProxy.createServer(options);
proxyServer.listen(8080);

var options2 = {
  router: {
    'mysql.mininoic.com': '127.0.0.1:3306'
  }
}

var proxyServer2 = httpProxy.createServer(options2);
proxyServer2.listen(3306);