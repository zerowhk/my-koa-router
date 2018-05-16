const http = require('http');
let EventEmitter = require('events');

const request = require('./request');
const response = require('./response');
const context = require('./context');

class Koa extends EventEmitter{
    constructor() {
        super();
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response = response;
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    listen(...args) {
        const server = http.createServer(this.callback());
        server.listen(...args);
    }

    callback() {
        return (req, res) =>{
            let ctx = this.createContext(req, res);
            let onerror = (err) => this.onerror(err, ctx);
            let fn = this.compose();
            // 在这里catch异常，调用onerror方法处理异常
            fn(ctx).then(() => this.responseBody(ctx)).catch(onerror);
        };
    }
    //每有一个请求,就创建一个context对象
    createContext(req, res) {
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);

        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;

        return ctx;
    }

    // 对客户端消息进行回复
    responseBody(ctx) {
        let content = ctx.body;
        if(typeof content === 'string') {
            ctx.res.end(content);
        }else if(typeof content === 'object') {
            ctx.res.end(JSON.stringify(content));
        }
    }
    //将所有的中间件合并为一个函数
    compose() {

        return async (ctx) => {
            function createNext(middleware, oldNext) {
                return async () => {
                    await middleware(ctx, oldNext);
                }
            }

            let middlewares = this.middlewares;
            let len = middlewares.length;
            let next = function() {
                return Promise.resolve();
            }

            for(let i = len - 1; i >= 0; i--) {
                next = createNext(middlewares[i], next);
            }

            await next();
        }
    }

    //错误处理
    onerror(err, ctx) {
        if (err.code === 'ENOENT') {
            ctx.status = 404;
        }
        else {
            ctx.status = 500;
        }
        let msg = err.message || 'Internal error';
        ctx.res.end(msg);
        // 触发error事件
        this.emit('error', err);
    }
}

module.exports = Koa; 
