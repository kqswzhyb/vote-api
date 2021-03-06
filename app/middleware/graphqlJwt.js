'use strict';

// Notice that this path is totally changed, because this function isn't
// directly exposed to the public, now we must still use that for the middle-
// ware.
const {graphqlKoa} = require('apollo-server-koa/dist/koaApollo');

// This has been newly imported, because in v2 of apollo-server, this is removed.
const {resolveGraphiQLString} = require('apollo-server-module-graphiql');
const errorMap = require("../graphql/utils/errorMap");

/**
 This function is directly copied from:
 https://github.com/apollographql/apollo-server/blob/300c0cd12b56be439b206d55131e1b93a9e6dade/packages/apollo-server-koa/src/koaApollo.ts#L51
 And now this has been removed since v2 at:
 https://github.com/apollographql/apollo-server/commit/dbaa465646b0acb839860a85bfd68fb4379d64ab#diff-64af8fdf76996fa3ed4e498d44124800
 So we must keep this here to be compatible with what it was before.
 Thus users can directly use that by upgrading graphql to the v2 WITHOUT
 doing any other big changes.
 * @param {Object} options The `options` of graphiqlKoa.
 * @return {Promise} The result of the graphiqlKoa.
 */
function graphiqlKoa(options) {
    return ctx => {
        const query = ctx.request.query;
        return resolveGraphiQLString(query, options, ctx)
            .then(graphiqlString => {
                ctx.set('Content-Type', 'text/html');
                ctx.body = graphiqlString;
            });
    };
}

/**
 * token鉴权 中间件
 * @param options
 * @param app
 * @returns {graphqlJwt}
 */

module.exports = (_, app) => {
    const options = app.config.graphql;
    const graphQLRouter = options.router;
    let graphiql = true;

    if (options.graphiql === false) {
        graphiql = false;
    }

    /**
     * 设置token超时 或者 失效
     */
    const setTokenInvalid = (ctx,code) => {
        ctx.status = 401;
        ctx.body = {
            code,
            message: errorMap[code]
        }
    };
    /**
     * 超时时间获取
     * @param app
     * @param token
     * @returns {boolean}  为true时则正常访问 为false时则超时
     */
    const getTimeout = async (ctx, token) => {
        // 解析token数据
        const tokenc = (token+'').slice(7);
        let redisToken = null
        try {
            const decode = ctx.app.jwt.verify(tokenc, app.config.jwt.secret);
            redisToken = await ctx.service.redis.get(decode.id);
        }catch {
            return false
        }
        return tokenc === redisToken;
    };

    return async (ctx, next) => {
        // 当前请求的路径
        const url = ctx.url;
        // 不需要鉴权的接口
        const csrf = app.config.security.csrf;
        // 免检验接口
        const throughPath = csrf.throughPath;
        // 如果包含直接通过
        if (throughPath.includes(url)) {
            await next();
            return;
        }
        if (ctx.request.body.query||ctx.request.method==='GET') {
            await next();
            return;
        }
        /**
         * 获取token信息
         */
        const token = ctx.request.header[csrf.headerName];
        // 如果token不存在 则返回 状态码为401
        if (!token) {
            setTokenInvalid(ctx,"1");
        } else {
            // 获取登录状态
            const timeState = getTimeout(ctx, token);
            // 如果登录超时 则返回
            if (!timeState) {
                setTokenInvalid(ctx,"2");
            } else {
                /* 如果接口Graphql则走此处要做下特殊处理*/
                if (ctx.path === graphQLRouter) {
                    const {
                        onPreGraphiQL,
                        onPreGraphQL,
                        apolloServerOptions,
                    } = options;
                    if (ctx.request.accepts(['json', 'html']) === 'html' && graphiql) {
                        if (onPreGraphiQL) {
                            await onPreGraphiQL(ctx);
                        }
                        return graphiqlKoa({
                            endpointURL: graphQLRouter,
                        })(ctx);
                    }
                    if (onPreGraphQL) {
                        await onPreGraphQL(ctx);
                    }
                    const serverOptions = Object.assign(
                        {},
                        apolloServerOptions,
                        {
                            schema: app.schema,
                            context: ctx,
                        }
                    );
                    return graphqlKoa(serverOptions)(ctx);
                }
                await next();
            }
        }
    };
};
