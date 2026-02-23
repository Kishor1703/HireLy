const Application = require('../models/Application');
const Job = require('../models/jobModel');
const User = require('../models/userModel');

// Apply to a Job
exports.applyToJob = async (req, res) => {
  const { jobId, resume } = req.body;
  const seekerId = req.user._id;

  try {
    if (!jobId || !resume) {
      return res.status(400).json({ message: 'jobId and resume are required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existing = await Application.findOne({ job: jobId, seeker: seekerId });
    if (existing) {
      return res.status(400).json({ message: 'You already applied for this job' });
    }

    const application = new Application({ job: jobId, seeker: seekerId, resume });
    await application.save();

    // Keep employee dashboard history in sync with applied jobs.
    await User.findByIdAndUpdate(
      seekerId,
      {
        $push: {
          jobsHistory: {
            title: job.title,
            description: job.description,
            salary: job.salary,
            location: job.location,
            applicationStatus: 'pending',
            user: seekerId,
          },
        },
      }
    );

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
