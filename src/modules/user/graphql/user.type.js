import { graphql, GraphQLBoolean, GraphQLObjectType, GraphQLString ,GraphQLList, GraphQLID} from "graphql";
import { attachmentType, OTPType } from "../../../utils/graphql/objecttype.js";

export const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString }, // يجب عدم إظهار كلمة المرور في الاستعلامات
    provider: { type: GraphQLString },
    genders: { type: GraphQLString },
    DOB: { type: GraphQLString },
    mobileNumber: { type: GraphQLString }, // يتم فك التشفير قبل إعادته
    role: { type: GraphQLString },
    isConfirmed: { type: GraphQLBoolean },
    deletedAt: { type: GraphQLString},
    bannedAt: { type: GraphQLString },
    updatedBy: { type: GraphQLID },
    changeCredentialTime: { type: GraphQLString },
    profilePic: { type: attachmentType },
    coverPic: { type: attachmentType },
    OTP: { type: new GraphQLList(OTPType) },
    isDeleted: { type: GraphQLBoolean }
  })
});