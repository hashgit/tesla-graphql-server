import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';

import data from './cms.json';

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type HomePage {
    heading: String
    subheading: String
    heroImageUrl: String
  }

  type Faq {
    title: String
    body: String
  }

  type Query {
    homePage: HomePage
    faqs: [Faq]
    faq(id: Int!): Faq
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  homePage: () => {
    return data.homepage;
  },
  faqs: () => {
    return data.faqs;
  },
  faq: ({ id }) => {
    return data.faqs[id];
  }
};

var app = express();
app.use(cors())
  .use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }))
  .use('/content', express.static('./dist/public/'));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
