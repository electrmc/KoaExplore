'use strict'

/**
 * 可使用中间件队列
 */

var http = require('http');
function Application (){
    this.context = {};
    this.context['res'] = null;
    this.middleware = [];
}
var app = Application.prototype;
var respond = function(next){
    console.log("start app....");
    next();
    this.res.writeHead(200, {'Content-Type': 'text/plain'});
    this.res.end(this.body);
}
var compose = function(){
    var that = this;
    var handlelist =  Array.prototype.slice.call(arguments,0);
    var _next = function(){
        // shift() 方法从数组中删除第一个元素，并返回该元素的值
        var handle = handlelist.shift();
        if(handle != undefined){
          handle.call(that.context,_next);
      }
    }
    return function(){
        _next();
    }
}
app.use = function(fn){
    this.middleware.push(fn);
}

app.callback = function(){
    // 将respond方法包装到数组中，并和middleware中的方法合并成一个新数组
    var mds = [respond].concat(this.middleware);
    var fn = compose.apply(this,mds);
    var that = this;
    return function(req,res){
       that.context.res = res;
       fn.call(that.context);
       //respond.call(that.context);
    }
}
app.listen = function(){
  var server = http.createServer(this.callback());
  return server.listen.apply(server, arguments);
};

//调用
var appObj = new Application();
appObj.use(function(next){
    console.log('1 head');
    this.body = "hello world!";
    next();
    console.log('1 end');
});
appObj.use(function(next){
    console.log('2 head');
    this.body += "by me!!";
    next();
    console.log('2 end');
});
appObj.use(function(next){
    console.log('3 head');
    console.log('3 end');
});
appObj.listen(3000);