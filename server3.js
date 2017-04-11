'use strict'

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
    //this.do = fn;
    this.middleware.push(fn)
}

app.callback = function(){
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
    this.body = "hello world!";
    next();
})
appObj.use(function(){
    this.body += "by me!!";
})
appObj.listen(3000);