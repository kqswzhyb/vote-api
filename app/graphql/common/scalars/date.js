const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const moment = require('moment');

module.exports = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return moment(new Date(value)).format('YYYY-MM-DD HH:mm:ss');
  },
  serialize(value) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10);
    }
    return null;
  },
});
