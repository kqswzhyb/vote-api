module.exports = {
    JsonBody: { // 这个名字对应上面 Controller 注释的@response 的 JsonBody。
        code: { type: 'string' }, // 服务器返回的数据。
        message: { type: 'string' }, // 服务器返回的数据。
    },
};