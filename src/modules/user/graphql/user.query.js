import { getUser, getUsers } from "./user.service.graphql.js"
import { getUserResponse, getUsersResponse } from "./user.response.js"
import { GraphQLID, GraphQLInt } from "graphql"
export const userQuery = {
    getUser: {
      type: getUserResponse,
      args: { id: { type: GraphQLID } },
      resolve: getUser,
    },
    getUsers: {
      type: getUsersResponse,
      resolve: getUsers,
    },
  };