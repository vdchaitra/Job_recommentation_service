import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";
import Modal from './model'; // Import the modal component

const API_URL = 'http://https://job-recommentation-service-4.onrender.com/api';

function App() {
  const [users, setUsers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userId, setUserId] = useState('');
  const [appliedJobs, setAppliedJobs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`);
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch recommendations for a specific user
  const getRecommendations = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/recommendations/${userId}`);
      setRecommendations(res.data);
      setAppliedJobs({});
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  // Handle apply button click
  const handleApply = (job) => {
    alert(`Successfully applied for ${job.job_title}!`);
    setAppliedJobs(prev => ({ ...prev, [job._id]: true }));
  };

  // Handle adding a new user
  const handleAddUser = async (newUser) => {
    try {
      const res = await axios.post(`${API_URL}/users`, newUser);
      setUsers(prev => [...prev, res.data]); // Update users list
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  return (
    <div className="App">
      <h1>Job Recommendation Service</h1>
      <div>
        <button className='addNew' onClick={() => setIsModalOpen(true)}>Add User</button>
        <h2>Select a User to Get Recommendations:</h2>
      </div>

      <select onChange={(e) => setUserId(e.target.value)}>
        <option value="">Select a user</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      <button onClick={() => getRecommendations(userId)}>Get Recommendations</button>

      {recommendations.length > 0 ? (
        <div>
          <h3>Recommended Jobs:</h3>
          <ul>
            {recommendations.map((job) => (
              <li key={job._id}>
                <div>
                  <h4>{job.job_title} at {job.company}</h4>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Job type:</strong> {job.job_type}</p>
                  <p><strong>Skills Required:</strong> {job.required_skills.join(', ')}</p>
                  <p><strong>Experience:</strong> {job.experience_level}</p>
                  {appliedJobs[job._id] ? (
                    <button disabled>Applied</button>
                  ) : (
                    <button onClick={() => handleApply(job)}>Apply Now</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        userId && <p>No recommendations available for this user.</p>
      )}

      {/* Modal for adding a new user */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddUser} />
    </div>
  );
}

export default App;
