import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';

const ProductType: GraphQLObjectType = new GraphQLObjectType({
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

export = ProductType;
