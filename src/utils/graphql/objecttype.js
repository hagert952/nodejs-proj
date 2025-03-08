import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const attachmentType=new GraphQLObjectType({
    name:'attachment',
    fields:{
secure_url:{type:GraphQLString}
,public_id:{type:GraphQLID}
}
})
export const OTPType=new GraphQLObjectType({
    name:'OTP',
    fields:{
code:{type:GraphQLString}
,type:{type:GraphQLID}
,expiresIn:{type:GraphQLString}
}
})