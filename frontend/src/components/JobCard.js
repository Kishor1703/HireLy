import React from "react";
import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{job.title}</h5>
        <p className="card-text">{job.company}</p>
        <p className="card-text"><small className="text-muted">{job.location}</small></p>
        <Link to={`/jobs/${job._id}`} className="btn btn-primary">View Details</Link>
      </div>
    </div>
  );
}

export default JobCard;
