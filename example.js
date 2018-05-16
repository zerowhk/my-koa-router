const Koa = require('./application');

const app = new Koa();
//对ctx进行扩展
app.context.echoData = function (errno = 0, data = null, errmsg = '') {
    this.res.setHeader('Content-Type', 'application/json;charset=utf-8');
    this.body = {
        errno,
        data,
        errmsg
    }
}



// app.use(async (ctx) => {
//     ctx.res.writeHead(200);

//     ctx.body = {
//         msg: 'hello ' + ctx.query.name
//     }
// });

// app.use(async ctx => {
//     let data = {
//         name: 'tom',
//         age: 16,
//         sex: 'male'
//     }
//     // 这里使用扩展，方便的返回utf-8格式编码，带有errno和errmsg的消息体
//     ctx.echoData(0, data, 'success');
// });

let responseData = {};

app.use(async(ctx, next) => {
    try {
        await next()
    }catch(err) {
        console.log('出错了');
        ctx.body = err.message;
    }
})

app.use(async (ctx, next) => {
    responseData.name = 'tom';
    await next();
    ctx.body = responseData;
});

app.use(async ctx => {
    responseData.sex = 'male';
    // 这里发生了错误，抛出了异常
    // throw new Error('oooops');
});

app.on('error', (err) => {
    console.log(err.stack);
});

app.listen(3000, () => {
    console.log('start Listen 3000....');
});