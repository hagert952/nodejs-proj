// import Post from "../../../db/model/users/users.model.js"
import { Company } from "../../../db/model/company.js";
import { User } from "../../../db/model/user.model.js"
import { isAuthenticate } from "../../../graphql/authentication.js"
import  {isAuthorized}  from "../../../graphql/authorization.js"
import { isValid } from "../../../middelwares/validation.middleware.js";
import { getSpecificCompany } from "../../company/company.validation.js";
import { getSpecificUser } from "../user.validation.js";import { GraphQLID, GraphQLInt,GraphQLBoolean } from "graphql"
// import  {isValid}  from "../../../graphql/validation.js"
// import { getSpecificPost } from "../post.validation.js"

export const getUsers = async () => {
    const users = await User.find(); 
    const company=await Company.find()
    return { success: true, status: 200, users:users,company:company };
  };
  export const getUser=async(_,args,context)=>{
    await isAuthenticate(context),
    // console.log(context);
 isAuthorized(context,['user']),
 isValid(getSpecificUser,args)
    const user=await User. findById(args.id);
     user.bannedAt = user.bannedAt ? null : new Date();
      await user.save();

      // return user.bannedAt !== null;
    return {
        success:true,
        status:200
        ,data: user.bannedAt !== null
    };

}
// export const userMutation = {
//   banUser: {
//     type: GraphQLBoolean,
//     args: {
//       id: { type: GraphQLID },
//     },
//     resolve: async (_, args, context) => {
//       await isAuthenticate(context),
//       // console.log(context);
//    isAuthorized(context,['user']),
//    isValid(getSpecificUser,args)
//       // Find the user
//       const user = await User.findById(args.id);
//       if (!user) throw new Error("User not found");

//       // Toggle the bannedAt field (ban if null, unban if set)
//       user.bannedAt = user.bannedAt ? null : new Date();
//       await user.save();

//       return user.bannedAt !== null; // true if banned, false if unbanned
//     },
//   },
// };

export const companyMutation=()=> {
  return {
    banCompany: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, context) => {
        await isAuthenticate(context);
        isAuthorized(context, ['user']);
        isValid(getSpecificCompany, args);

        // Find the company
        const company = await Company.findById(args.id);
        if (!company) throw new Error("Company not found");

        // Toggle the bannedAt field (ban if null, unban if set)
        company.bannedAt = company.bannedAt ? null : new Date();
        await company.save();

        return company.bannedAt !== null; // true if banned, false if unbanned
      },
    },
  };
}

export const userMutation=()=> {
  return {
    banUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, context) => {
        await isAuthenticate(context);
        isAuthorized(context, ['user']);
        isValid(getSpecificUser, args);

        // Find the company
        const user = await User.findById(args.id);
        if (!user) throw new Error("Company not found");

        // Toggle the bannedAt field (ban if null, unban if set)
        user.bannedAt = user.bannedAt ? null : new Date();
        await user.save();

        return user.bannedAt !== null; // true if banned, false if unbanned
      },
    },
  };
}
export const approveCompany=()=>{
return {approveCompany: {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, args, context) => {
    await isAuthenticate(context);
    isAuthorized(context, ['user']); // Only admin should approve

    // Find the company
    const company = await Company.findById(args.id);
    if (!company) throw new Error("Company not found");

 

    company.approvedByAdmin =true;
    await company.save();

    return company.approvedByAdmin =true; 
  },
},
}}
