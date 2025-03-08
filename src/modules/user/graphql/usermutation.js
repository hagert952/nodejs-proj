import { companyMutation, getUser, getUsers, userMutation } from "./user.service.graphql.js"
import { companyMutationResponse, getUserResponse, getUsersResponse, userMutationResponse } from "./user.response.js"
import { GraphQLID, GraphQLInt } from "graphql"
export const userMutations = {
    // getUser: {
    //   type: getUserResponse,
    //   args: { id: { type: GraphQLID } },
    //   resolve: getUser,
      // 
    // },
    companyMutation: {
      type: companyMutationResponse,
      resolve: companyMutation,
    },
    userMutation: {
      type: userMutationResponse,
      resolve: userMutation,
    },
  };