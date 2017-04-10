'use strict'

/**
 * 中间件的初步模型
 * 只能支持一个中间件
 */ 
var http = require('http');
function Application (){
    this.context = {};
    this.context['res'] = null;
}

var app = Application.prototype;

function respond(){
    this.res.writeHead(200, {'Content-Type': 'text/plain'});
    this.res.end(this.body);
}

app.use = function(fn){
    this.do = fn;
}

/*
 * 处理request的入口
 * 1，在外层无名方法中拿到当前的app和所有的中间件方法。
 *   这里所有的中间件方法就只有fn，可以用一个最简单的数组进行管理function array
 * 2，返回一个function，在此function中对request和response进行处理
 */ 
app.callback = function(){
    var fn = this.do;
    var that = this;
    return function(req,res){
       that.context.res = res;
       fn.call(that.context);
       respond.call(that.context);
    }
}

app.listen = function(){
  var server = http.createServer(this.callback());
  return server.listen.apply(server, arguments);
};

//调用
var appObj = new Application();
appObj.use(function(){
    this.body = "hello world!";
})
appObj.listen(3000);