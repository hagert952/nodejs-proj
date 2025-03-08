import  {Types,Schema,model} from 'mongoose'
import { hash } from '../../utils/hashing/hash.js';
import { Encrypt } from '../../utils/encryption/encrypt.js';
import * as enums from '../model/enums/user.enums.js';
import bcrypt from 'bcrypt'
import cryptoJs from "crypto-js";
export const defaultPublicId="close-circle_fjiop1"
export const defaultPublicId2="close-circle_fjiop2"
export const defaultProfilePic="uploads/download.png"
const userSchema=new Schema(
  {
   firstName:{type:String},
   lastName:{type:String},
  //  userName:{
  //   virtual: true,
  //   get: function() {
  //     return `${this.firstName} ${this.lastName}`;
  //   }
  //  },
   email:{
    type:String,unique:[true,'email already exists']
   },
   password:{type:String},
provider:{type:String,enum:Object.values(enums.provider),default: enums.provider.SYSTEM},
genders:{type:String,enum:Object.values(enums.genders),default: enums.genders.MALE},
   DOB: {
  type: Date,
  validate: {
    validator: function(value) {
      const age = new Date().getFullYear() - value.getFullYear();
      return age >= 18 && value < new Date();
    },
    message: "DOB must be in the past, and user must be at least 18 years old."
  }
}
,mobileNumber:String,
role:{type:String,enum :Object.values(enums.roles),default:enums.roles.USER}
,isConfirmed:{type:Boolean,default:false}
,deletedAt:{type:Date}
,bannedAt:{type:Date},
updatedBy:{ref:"USER",type:Types.ObjectId},
changeCredentialTime:{type:Date},
profilePic:{secure_url:String,public_id:{type:String,default:defaultPublicId}},
coverPic:{secure_url:String,public_id:{type:String,default:defaultPublicId}},
OTP: [{
  code: {
    type: String,
   
  },
  type: {
    type: String,
    enum:Object.values(enums.otptype),
   
  },
  expiresIn: {
    type: Date,
  },
}],
isDeleted: { type: Boolean, default: false },

},
  {timestamps:true}
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  if(this.isModified("mobileNumber")){
    this.mobileNumber=cryptoJs.AES.encrypt(this.mobileNumber,process.env.CRYPTO_KEY).toString();
    
  }
  next();
});
userSchema.post("findOne", function (doc) {
  if (doc && doc.mobileNumber) {
    const bytes = cryptoJs.AES.decrypt(doc.mobileNumber, process.env.CRYPTO_KEY);
    doc.mobileNumber = bytes.toString(cryptoJs.enc.Utf8);
  }
});

// Decrypt after querying multiple users
userSchema.post("find", function (docs) {
  docs.forEach((doc) => {
    if (doc.mobileNumber) {
      const bytes = cryptoJs.AES.decrypt(doc.mobileNumber,process.env.CRYPTO_KEY);
      doc.mobileNumber = bytes.toString(cryptoJs.enc.Utf8);
    }
  });
});
// userSchema.post("findByIdBY", function (docs) {
//   docs.forEach((doc) => {
//     if (doc.mobileNumber) {
//       const bytes = cryptoJs.AES.decrypt(doc.mobileNumber,process.env.CRYPTO_KEY);
//       doc.mobileNumber = bytes.toString(cryptoJs.enc.Utf8);
//     }
//   });
// });
userSchema.pre('remove', async function (next) {
  const user = this;
  // Delete related applications
  await Application.deleteMany({ userId: user._id });
  // Delete related chats
  await Chat.deleteMany({ $or: [{ senderId: user._id }, { receiverId: user._id }] });
  // Delete related companies
  await Company.deleteMany({ CreatedBy: user._id });
  // Delete related job opportunities
  await JobOpportunity.deleteMany({ addedBy: user._id });
  next();
});
export const User=model("User", userSchema);
