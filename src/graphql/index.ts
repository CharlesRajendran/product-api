/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
} from 'graphql';

import got from 'got';

import ProductType from './types/Product';

const RootQuery:GraphQLObjectType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getProducts: {
      type: new GraphQLList(ProductType),
      resolve: async () => {
        const result: any = await got.get(process.env.API_BASE_ENDPOINT);

        if (result.body) {
          const data: any[] = JSON.parse(result.body).data.products;
          return data;
        }
        return [];
      },
    },
  },
});

const Mutation:GraphQLObjectType = new GraphQLObjectType({
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
          name, brand, image, unit, unit_price,
        } = args;

        // API Request
        const result: any = await got.post(process.env.API_BASE_ENDPOINT, {
          json: {
            name,
            brand,
            image,
            unit,
            unit_price,
          },
          responseType: 'json',
        });

        return result.body.data;
      },
    },
  },
});

export = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
