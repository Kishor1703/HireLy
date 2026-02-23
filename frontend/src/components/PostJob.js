import React, { useState } from "react";
import { postJob } from "../api";

function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await postJob(formData, token);
      alert("Job posted successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post a Job</h2>
      <input type="text" name="title" placeholder="Job Title" onChange={handleChange} />
      <textarea name="description" placeholder="Job Description" onChange={handleChange} />
      <input type="text" name="company" placeholder="Company Name" onChange={handleChange} />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} />
      <input type="number" name="salary" placeholder="Salary" onChange={handleChange} />
      <button type="submit">Post Job</button>
    </form>
  );
}

export default PostJob;
