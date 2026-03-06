import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function JobPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState('');
  const [locations, setLocations] = useState([]);
  const [jobType, setJobType] = useState('');
  const [categories, setCategories] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [{ data: categoryData }, { data: locationData }] = await Promise.all([
          axios.get('/api/type/jobs'),
          axios.get('/api/location/jobs'),
        ]);
        setCategories(categoryData?.jobT || []);
        setLocationOptions(locationData?.jobLocations || []);
      } catch (err) {
        setError('Failed to load categories and locations');
      }
    };
    loadReferenceData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/job/create', { title, description, salary, locations, jobType });
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="job-post-container">
      <h2>Post a Job</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />
        <select
          multiple
          value={locations}
          onChange={(e) => setLocations(Array.from(e.target.selectedOptions, (option) => option.value))}
          required
        >
          {locationOptions.map((location) => (
            <option key={location._id} value={location._id}>
              {location.locationName}
            </option>
          ))}
        </select>
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.jobTypeName}
            </option>
          ))}
        </select>
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default JobPost;
