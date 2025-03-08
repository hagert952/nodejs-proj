import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { userType } from "./user.type.js";
import { companyType } from "../../company/graphql/company.type.js";

export const getUsersResponse=
new GraphQLObjectType({
    name:"getPostsResponse",
    fields:{
        success:{type:GraphQLBoolean},
        status:{type:GraphQLInt},
        users:{type:new GraphQLList( userType)},
        company:{type:new GraphQLList( companyType)}
    }
    });
export const getUserResponse=new GraphQLObjectType({
name:"getSinglePostResponse",
fields:{
    success:{type:GraphQLBoolean},
    status:{type:GraphQLInt},
    data:{type:userType}
}
});
export const companyMutationResponse=

new GraphQLObjectType({
    name:"getPostsResponsess",
    fields:{
        success:{type:GraphQLBoolean},
        status:{type:GraphQLInt},
        
    }
    });
export const userMutationResponse=
new GraphQLObjectType({
    
    name:"getPostsResponses",
    fields:{
        success:{type:GraphQLBoolean},
        status:{type:GraphQLInt},
        
    }
    });