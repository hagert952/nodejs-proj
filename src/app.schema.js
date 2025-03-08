import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { userQuery } from "./modules/user/graphql/user.query.js";
import * as userMutations from "./modules/user/graphql/usermutation.js";
import {  approveCompany, companyMutation, userMutation,// userMutation } 
}from "./modules/user/graphql/user.service.graphql.js";
// import { companyMutations } from "./modules/user/graphql/user.service.graphql.js";


const mutation= new GraphQLObjectType({
  name: "Mutation",
  fields:{...userMutation(),...companyMutation(),...approveCompany()}
});
const query = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
      ...userQuery,
    },
});

export const schema = new GraphQLSchema({
    query,mutation
});
 