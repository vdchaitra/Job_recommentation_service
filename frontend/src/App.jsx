import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userId, setUserId] = useState('');

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
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  return (
    <div className="App">
      <h1>Job Recommendation System</h1>

      <h2>Select a User to Get Recommendations:</h2>
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
                {job.job_title} at {job.company}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        userId && <p>No recommendations available for this user.</p>
      )}
    </div>
  );
}

export default App;
