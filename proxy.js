var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs');

var proxy_table = '../.proxy_table';
var options;

function getProxyTable(){
	options = {
	  router: JSON.parse(fs.readFileSync(proxy_table));
	};
}

getProxyTable();

var proxyServer;

function startServer(){
	proxyServer = httpProxy.createServer(options);
	proxyServer.listen(8080);
}

startServer();

fs.watchFile(proxy_table, function(current, previous){
	getProxyTable();
	proxyServer.close();
	startServer();
})