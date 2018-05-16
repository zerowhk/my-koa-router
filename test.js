async function m1(next) {
    console.log('m1--->');
    await next();
    console.log('<---m1');   
}

async function m2(next) {
    console.log('m2--->');
    await next();
    console.log('<---m2');    
}

async function m3(next) {
    console.log('m3');
    await next();
}

async function m4() {
    console.log('m4');
}

// let next1 = async () => {
//     await m3();
// }

// let next2 = async () => {
//     await m2(next1);
// }


function createNext(middleware, oldNext) {
    return async () => {
        await middleware(oldNext);
    }
}

// let next1 = createNext(m3, null);
// let next2 = createNext(m2, next1);
// let next3 = createNext(m1, next2);
// next3();

function compose(middlewares) {
    let next = async function (next) {
        if(typeof next === 'function') {
            await next();
        }
        return Promise.resolve();
    }

    for(let i = middlewares.length - 1; i >= 0; i--) {
        next = createNext(middlewares[i], next);
    }

    return next;
}

let next = compose([m1, m2, m3]);
let fn = async function(next2) {
    next();
    await next2();
}
fn2 = compose([fn, m4]);
fn2();

 