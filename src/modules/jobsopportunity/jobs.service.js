import { hrSockets } from "../../../index.js";
import { Application } from "../../db/model/application.js";
import { Company } from "../../db/model/company.js";
import { JobOpportunity } from "../../db/model/jobOpportunity.js";
import { sendEmail } from "../../utils/email/send-email.js";

export const addJob= async (req, res,next) => {

    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId } = req.body;
    const userId = req.authuser._id; 

    // Find the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
if(company.approvedByAdmin==false)
  return next(new Error("company not approved",{cause:400}))
    // Check if the user is the company owner or HR
    // const isOwner = company.CreatedBy.toString() === userId.toString();
    // const isHR = company.HRs.some((hrId) => hrId.toString() === userId.toString());

 

    // Create the job
    const newJob = new JobOpportunity({
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      companyId,
      addedBy: userId, // Assign the creator
    });

    await newJob.save();
    return res.status(201).json({ message: "Job added successfully", job: newJob });

  }
  export const updateJob=async(req,res,next)=>{
    const {jobId}=req.params;
    const job =await JobOpportunity.findOneAndUpdate({jobId});
    res.status(201).json({success:true,message:"job updated successfully",data:job})
  }
  export const deleteJob = async (req, res,next) => {

        const { jobId } = req.params; // Extract jobId from URL parameters
        const userId = req.authuser._id; // Assuming the authenticated user's ID is stored in req.user

        // Find the job by ID
        const job = await JobOpportunity.findById(jobId);
        if (!job) {
            return next(new Error("job not found"));
        }

        // Find the company associated with the job
        const company = await Company.findById(job.companyId);
        if (!company) {
          return next(new Error("Company not found",{cause:404}))
        }

        const isHR = company.HRs.some(hrId => hrId.toString() == userId.toString());
      if(!isHR)return next(new Error ("hr only can delete",{cause:400}))

        const deletedJob = await JobOpportunity.findByIdAndDelete(jobId);

        res.status(200).json({ message: "Job deleted successfully", job: deletedJob });

    }

  export const getcompjob= async (req, res,next) => {
      const { companyId, jobId } = req.params;
      const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;
  
      // Check if the company exists
      const company = await Company.findById(companyId);
      if (!company) {
        return next(new Error ("company not found",{cause:400}))
      }
  
      let query = { companyId };
  
      // If a specific jobId is provided, filter by it
      if (jobId) {
        query._id = jobId;
      }
  
      // Apply pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const jobs = await JobOpportunity.find(query,).populate('companyId')
        .sort({ [sort]: order === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit));
  
      // Get total count for pagination
      const totalCount = await JobOpportunity.countDocuments(query);
  
      return res.status(200).json({
        message: jobId ? "Job retrieved successfully" : "Jobs retrieved successfully",
        totalJobs: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        jobs,
      });
  }
  
  export const allOrOne= async (req, res,next) => {
      const { 
        workingTime, 
        jobLocation, 
        seniorityLevel, 
        jobTitle, 
        technicalSkills, 
        page = 1, 
        limit = 10, 
        sort = "createdAt", 
        order = "desc" 
      } = req.query;
  
      let filter = {};
  
      // Apply filters if provided
      if (workingTime) filter.workingTime = workingTime;
      if (jobLocation) filter.jobLocation = jobLocation;
      if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
      if (jobTitle) filter.jobTitle = new RegExp(jobTitle, "i"); // Case-insensitive search
      if (technicalSkills) {
        const skillsArray = technicalSkills.split(",");
        filter.technicalSkills = { $all: skillsArray }; // Match all provided skills
      }
  
      // Pagination calculations
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const jobs = await JobOpportunity.find(filter)
        .sort({ [sort]: order === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit));
  
      const totalCount = await JobOpportunity.countDocuments(filter);
  
      return res.status(200).json({
        message: "Jobs retrieved successfully",
        totalJobs: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        jobs,
      });
  };

export const getJobs = async (req, res,next) => {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'createdAt', 
      order = 'desc', 
      workingTime, 
      jobLocation, 
      seniorityLevel, 
      jobTitle, 
      technicalSkills 
    } = req.query;

    const filters = {};

    if (workingTime) filters.workingTime = workingTime;
    if (jobLocation) filters.jobLocation = jobLocation;
    if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
    if (jobTitle) filters.jobTitle = { $regex: jobTitle, $options: 'i' }; // Case-insensitive search
    if (technicalSkills) filters.technicalSkills = { $in: technicalSkills.split(',') };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const jobs = await JobOpportunity.find(filters)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('addedBy', 'firstName lastName') // Populate user details
      .populate('companyId', 'name'); // Populate company details

    const totalCount = await JobOpportunity.countDocuments(filters);

    return res.json({
      totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      jobs,
    });

};

  
  export const applicationsForJob= async (req, res,next) => {
  
      const { jobId } = req.params;
      const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;
  
      // Validate that the job exists
      const job = await JobOpportunity.findById(jobId).populate("companyId");
      if (!job) {
next(new Error("job not found"))
      }
  
      // Only allow the Company Owner or HR to view applications
      const requestingUser = req.user; // Assume this is extracted from authentication middleware
     
  
      // Pagination calculations
      const skip = (parseInt(page) - 1) * parseInt(limit);
  
      // Fetch applications with user details
      const applications = await Application.find({ jobId })
        .populate({
          path: "userId",
          select: "name email phone" // Select necessary user fields
        })
        .sort({ [sort]: order === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit));
  
      const totalCount = await Application.countDocuments({ jobId });
  
      return res.status(200).json({
        message: "Applications retrieved successfully",
        totalApplications: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        applications,
      });

  }
  export const  applyToJob=async(req, res,next) => {
      const { jobId } = req.params;
      const { coverLetter, resume } = req.body;
      const userId = req.authuser._id; // Extract user ID from authentication middleware
    
  
      // Validate job existence
      const job = await JobOpportunity.findById(jobId).populate("companyId");
      if (!job) {
next (new Error("job not found",{cause:404}))
      }
  
      // Check if user has already applied to the job
      const existingApplication = await Application.findOne({ jobId, userId });
      if (existingApplication) {
        return next(new Error("You have already applied for this job"))
      }
  
      // Create new job application
      const newApplication = await Application.create({ jobId, userId, coverLetter, resume });
  
      // Emit a real-time event to notify HR
      const io = req.app.get("socketio");
  
      // Find HR users of the company
      const hrUsers = await User.find({ companyId: job.companyId, });

  
      hrUsers.forEach((hr) => {
        const hrSocketId = req.app.get("socketio").sockets.get(hrSockets.get(hr._id.toString()));
        if (hrSocketId) {
          io.to(hrSocketId).emit("newApplication", {
            message: `A new application has been submitted for ${job.jobTitle}`,
            jobId: jobId,
            applicantId: userId,
          });
        }
      });
  
      return res.status(201).json({
        message: "Application submitted successfully",
        application: newApplication,
      });
  }









 export const rejectAccept=async (req, res,next) => {
      const { applicationId } = req.params;
      const { status } = req.body;
   // Extract role
  
      // if (hrRole !== "HR") {
      //   return res.status(403).json({ message: "Only HR can update application status" });
      // }
  
      // Validate status value
      if (!["accepted", "rejected"].includes(status)) {
        return next( new Error("Use 'Accepted' or 'Rejected'",{cause:400}))
      }
  
      // Find application
      const application = await Application.findById(applicationId).populate("userId jobId");
      if (!application) {
        return next(new Error("no application found",{cause:400}))
      }
  
      // Update application status
      application.status = status;
      await application.save();
  
      // Send Email Notification
      const userEmail = application.userId.email;
      const jobTitle = application.jobId.jobTitle;
  
      const subject =
        status === "accepted" ? `Job Application Accepted: ${jobTitle}` : `Job Application Rejected: ${jobTitle}`;
      const text =
        status === "accepted"
          ? `Congratulations! Your application for ${jobTitle} has been accepted.`
          : `We regret to inform you that your application for ${jobTitle} has been rejected.`;
  
      await sendEmail({to:userEmail, subject:subject, html:text});
  
      return res.status(200).json({ message: `Application ${status} successfully` });
  }








