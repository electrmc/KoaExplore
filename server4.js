/**
 * 这不是一个服务器程序，只是简单的延时koa的实现方式
 */
var co = require('co');

function SimpleKoa(){
    this.middlewares = [];
}

SimpleKoa.prototype = {
    //注入个中间件
    use: function(gf){
        this.middlewares.push(gf);
    },
    //执行中间件
    listen: function(){
        this._run();
    },
    _run: function(){
        var ctx = this;
        var middlewares = ctx.middlewares;
        return co(function *(){
            var prev = null;
            var i = middlewares.length;
            //从最后一个中间件到第一个中间件的顺序开始遍历
            while (i--) {
                //实际koa的ctx应该指向server的上下文，这里做了简化
                //prev 将前面一个中间件传递给当前中间件
                prev = middlewares[i].call(ctx, prev);
            }
            //执行第一个中间件
            yield prev;
        });
    }
};

var app = new SimpleKoa();

app.use(function *(next){
    console.log('11');
    this.body = '1';
    yield next;
    console.log('12');
    this.body += '5';
    console.log(this.body);
});
app.use(function *(next){
    console.log('21');
    this.body += '2';
    yield next;
    console.log('22');
    this.body += '4';
});
app.use(thunkfunction);
app.use(promisefunction);
app.use(function *(next){
    console.log('31');
    this.body += '3';
    console.log('32');
});

function *thunkfunction(next) {
    var r1 = yield asyncthunk('1');
    console.log(r1);
    yield next;
    var r2 = yield asyncthunk('2');
    console.log(r2);
}

function asyncthunk(str) {
    return function (callback){
        // do something 
        console.log('thunk function');
        setTimeout(function(){
            var r = 'this is test : ' + str;
            callback(null,r);
        },3000);
    }
}

function *promisefunction(next) {
    var r1 = yield asyncpromise('1');
    console.log(r1);
    yield next;
    var r2 = yield asyncpromise('2');
    console.log(r2);
}

function asyncpromise(str){
    return new Promise(function(resolve,reject){
        var r = 'this is promise : ' + str;
        setTimeout(()=>{
            resolve(r);
        },3000);
        
    });
}

app.listen();