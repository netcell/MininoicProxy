var http = require('http'),
	httpProxy = require('http-proxy'),
    fs = require('fs'),
    connect = require('connect');

var homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var proxy_table = homepath + '/.proxy_table';
var static_table = homepath + '/.static_table';

var proxy_server = {};

function get_proxy_table(proxy_table){
	return {
	  router: JSON.parse(fs.readFileSync(proxy_table)),
	};
}

function start_proxy_server(){
	var options = get_proxy_table(proxy_table);
	proxy_server.close = proxy_server.close || function(){};
	proxy_server.close();
	proxy_server = httpProxy.createServer(options);
	proxy_server.listen(8080);
}

start_proxy_server();
fs.watchFile(proxy_table, start_proxy_server)

function get_static_table(static_table){
	return JSON.parse(fs.readFileSync(static_table));
}

function start_a_static_server(options){
    var static_server = connect();
    var paths = options.paths
    for (var i = paths.length - 1; i >= 0; i--) {
    	static_server.use( connect.static(paths[i]) )
    }
    return http.createServer(app).listen(options.port);
}

var static_servers = [];

function start_static_servers(){
	for (var i = static_servers.length - 1; i >= 0; i--) {
		static_servers[i].close = static_servers[i].close || function(){};
		static_servers[i].close();
	};
	static_servers = [];
	var list = get_static_table(static_table);
	for (var i = list.length - 1; i >= 0; i--) {
		static_servers.push(start_a_static_server(list[i]));
	};
}

start_static_servers();
fs.watchFile(static_table, start_static_servers);
