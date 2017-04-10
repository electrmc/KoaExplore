'use strict'
// 实现最基本的http服务器
var http  = require('http');

// http服务器的入口，监听request请求
var server = http.createServer((request,response)=>{
    response.writeHead(200,{'Content-Type':'text/plain'});
    response.end('hello world\n');
});
server.listen(3000);
console.log('server listening 3000 port');