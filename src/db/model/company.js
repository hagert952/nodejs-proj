import { Types, Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: { type: String, unique: [true, "Company name already exists"] },
    description: { type: String },
    industry: { type: String },
    address: { type: String },
    numberOfEmployees: { type: Number },
    companyEmail: { type: String, unique: [true, "Company email already exists"] },
    CreatedBy: { type: Types.ObjectId, ref: "User" },
    logo: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    HRs: [{ type: Types.ObjectId, ref: "User" }],
    bannedAt: { type: Date },
    deletedAt: { type: Date },
    legalAttachment: { secure_url: String, public_id: String },
    approvedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual populate for jobs
companySchema.virtual("jobs", {
  ref: "JobOpportunity", // Match the JobOpportunity model name
  localField: "_id", // Company _id
  foreignField: "companyId", // Matches companyId in JobOpportunity
});

companySchema.pre('remove', async function (next) {
  const company = this;
  // Delete related job opportunities
  await JobOpportunity.deleteMany({ companyId: company._id });
  next();
});
companySchema.set("toObject", { virtuals: true });
companySchema.set("toJSON", { virtuals: true });

export const Company = model("Company", companySchema);
