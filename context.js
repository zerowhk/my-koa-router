// module.exports = {

//     get query() {
//         return this.request.query;
//     },

//     get body() {
//         return this.response.body;
//     },

//     set body(data) {
//         this.response.body = data;
//     },

//     get status() {
//         return this.response.status;
//     },

//     set status(statusCode) {
//         this.response.status = statusCode;
//     }

// };


let proto = { };

//为proto名为property的属性设置setter
function delegateSet(property, name) {
    proto.__defineSetter__(name, function (val) {
        this[property][name] = val;
    });
}

//为proto名为property的属性设置getter
function delegateGet(property, name) {
    proto.__defineGetter__(name, function(){
        return this[property][name];
    })
}

// 定义request中要代理的setter和getter
let requestSet = [];
let requestGet = ['query'];

// 定义response中要代理的setter和getter
let responseSet = ['body', 'status'];
let responseGet = responseSet;

requestSet.forEach((name) => {
    delegateSet('request',name);
})

requestGet.forEach((name) => {
    delegateGet('request',name);
})

responseSet.forEach((name) => {
    delegateSet('response',name);
})

responseGet.forEach((name) => {
    delegateGet('response',name);
})

module.exports = proto;

