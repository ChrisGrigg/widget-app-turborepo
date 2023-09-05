new CfnGraphQLSchema(this, 'WidgetsSchema', {
  apiId: widgetsGraphQLApi.attrApiId,
  definition: `type ${tableName} {
    ${tableName}Id: ID!
    name: String
  }
  type Paginated${tableName} {
    widgets: [${tableName}!]!
    nextToken: String
  }
  type Query {
    all(limit: Int, nextToken: String): Paginated${tableName}!
    getOne(${tableName}Id: ID!): ${tableName}
  }
  type Mutation {
    save(name: String!): ${tableName}
    delete(${tableName}Id: ID!): ${tableName}
  }
  type Schema {
    query: Query
    mutation: Mutation
  }`
});