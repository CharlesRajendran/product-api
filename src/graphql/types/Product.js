const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    slug: { type: GraphQLString },
    sku: { type: GraphQLString },
    brand: { type: GraphQLInt },
    image: { type: GraphQLString },
    unit: { type: GraphQLString },
    unit_price: { type: GraphQLString },
  }),
});

module.exports = ProductType;
