import { graphql, GraphQLBoolean, GraphQLObjectType, GraphQLString ,GraphQLList, GraphQLID, GraphQLInt} from "graphql";
import { attachmentType, OTPType } from "../../../utils/graphql/objecttype.js";
import { userType } from "../../user/graphql/user.type.js";

export const companyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    _id: { type: GraphQLID },
   companyName: { type: GraphQLString},
       description: { type: GraphQLString },
       industry: { type: GraphQLString },
       address: { type: GraphQLString },
       numberOfEmployees: { type: GraphQLInt },
       companyEmail: { type:GraphQLString },
       CreatedBy: { type: new GraphQLList(userType) },
       logo: { type:attachmentType },
       coverPic: { type:attachmentType},
       HRs:{type:new GraphQLList(userType)},
       bannedAt: { type: GraphQLString },
       deletedAt: { type: GraphQLString },
       legalAttachment: { type:attachmentType },
       approvedByAdmin: { type: GraphQLBoolean },
  })
});