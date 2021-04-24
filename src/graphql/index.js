const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
} = require('graphql');

const got = require('got');

const ProductType = require('./types/Product');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getProducts: {
      type: new GraphQLList(ProductType),
      resolve: async () => {
        const result = await got(process.env.API_BASE_ENDPOINT);

        if (result.body) {
          const data = JSON.parse(result.body).data.products;
          return data;
        }

        return [];
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createProduct: {
      type: ProductType,
      args: {
        name: { type: GraphQLString },
        brand: { type: GraphQLString },
        image: { type: GraphQLString },
        unit: { type: GraphQLString },
        unit_price: { type: GraphQLFloat },
      },
      resolve: async (parent, args) => {
        const {
          name, brand, image, unit, unit_price
        } = args;

        // API Request
        const result = await got.post(process.env.API_BASE_ENDPOINT, {
          json: {
            name,
            brand,
            image,
            unit,
            unit_price,
          },
          responseType: 'json',
        });

        console.log(typeof result.body.data);

        return result.body.data;
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
