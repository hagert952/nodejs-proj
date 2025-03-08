import  {Types,Schema,model} from 'mongoose'

export const jopLocation={
    ONSITE:"onSite",
    REMOTLY:"remotly",
    HYBRID:"hybrid",
};

export const workingTime={
    FULL_TIME:"full-time",
   PART_TIME:"part-Time",
  };
export const seniorityLevel={
    FRESH:"fresh",
   JONIOR:"jonior",
   MID_LEVEL:"Mid-Level",
   SENIOR:"senior",
   TEAM_LEAD:"team-lead"
  };
const jobOpportunitySchema=new Schema(
 {
jobTitle:{type:String},
jobLocation:{type:String,
enum:Object.values(jopLocation),
default: jopLocation.ONSITE}
,workingTime:{type:String,
    enum:Object.values(workingTime),
    default: workingTime.FULL_TIME 
}
,seniorityLevel :{
    type:String,
    enum:Object.values(seniorityLevel),
    default: seniorityLevel.FRESH 
},
jobDescription:{
    type:String,

},
technicalSkills:{type:[String]},
softSkills:{type:[String]},
addedBy:{type:Types.ObjectId,ref:"User"}
,updatedBy:{type:Types.ObjectId,ref:"User"}
,closed:{type:Boolean}
,companyId:{type:Types.ObjectId,ref:"Company"}
},
  {timestamps:true}
);
jobOpportunitySchema.virtual("userDetails", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true, // Return a single user object
  });
  jobOpportunitySchema.pre('remove', async function (next) {
    const job = this;
    // Delete related applications
    await Application.deleteMany({ jobId: job._id });
    next();
  });
  
export const JobOpportunity=
model("JobOpportunity",jobOpportunitySchema);
