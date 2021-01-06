module.exports = {
    baseBody: { 
        code: { type: 'string' }, 
        message: { type: 'string' }, 
    },
    loginBody: {
        code: { type: 'string' }, 
        data: { type: 'string' },
        message: { type: 'string' }, 
    },
    login: {
        username: { type: 'string', required: true, description: '用户名' },
        qqOpenId: { type: 'string', required: true, description: '密码' },
    },
};