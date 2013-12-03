var http = require('http'),
	httpProxy = require('http-proxy'),
    fs = require('fs'),
    connect = require('connect');

var homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var proxy_table = homepath + '/.proxy_table';
var static_table = homepath + '/.static_table';

var proxy_server = {};

function get_proxy_table(proxy_table){
	var rs = JSON.parse(fs.readFileSync(proxy_table));
	for (r in rs) {
		rs[r] = "127.0.0.1:"+ rs[r]
	};
	return { router: rs };
}

function start_proxy_server(){
	var options
	try {
		options = get_proxy_table(proxy_table);
	} finally {
		proxy_server.close = proxy_server.close || function(){};
		proxy_server.close();
		proxy_server = httpProxy.createServer(options);
		proxy_server.listen(8080);
	}
}

start_proxy_server();
fs.watchFile(proxy_table, start_proxy_server);

function get_static_table(static_table){
	return JSON.parse(fs.readFileSync(static_table));
}

function start_a_static_server(port,paths){
    var static_server = connect();
    for (var i = paths.length - 1; i >= 0; i--) {
    	var path = paths[i];
    	switch (path[i]) {
    		case '~': path = homepath + path.substring(1); break;
    		case '.': path = __dirname + path.substring(1); break;
    	}
    	static_server.use( connect.static( path ) );
    }
    return http.createServer(static_server).listen(port);
}

var static_servers = [];

function start_static_servers(){
	var table;
	try {
		table = get_static_table(static_table);
	} finally {
		static_servers = [];
		for (var i = static_servers.length - 1; i >= 0; i--) {
			static_servers[i].close = static_servers[i].close || function(){};
			static_servers[i].close();
		};
		for (port in table) {
			static_servers.push(start_a_static_server(port,table[port]));
		};
	}
}

start_static_servers();
fs.watchFile(static_table, start_static_servers);
