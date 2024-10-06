// Modal.js
import React from 'react';
import './model.css'; 

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = React.useState('');
  const [skills, setSkills] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [preferences, setPreferences] = React.useState({
    desired_roles: '',
    location: '',
    job_type: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name,
      skills: skills.split(',').map(skill => skill.trim()),
      experience_level: experience,
      preferences: {
        desired_roles: preferences.desired_roles.split(',').map(role => role.trim()),
        location: preferences.location.split(',').map(loc => loc.trim()),
        job_type: preferences.job_type,
      },
    };
    onSubmit(newUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label>Skills:</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} required />
          </div>
          <div>
            <label>Experience Level:</label>
            <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} required />
          </div>
          <div>
            <label>Desired Roles:</label>
            <input type="text" value={preferences.desired_roles} onChange={(e) => setPreferences({ ...preferences, desired_roles: e.target.value })} />
          </div>
          <div>
            <label>Location:</label>
            <input type="text" value={preferences.location} onChange={(e) => setPreferences({ ...preferences, location: e.target.value })} />
          </div>
          <div>
            <label>Job Type:</label>
            <input type="text" value={preferences.job_type} onChange={(e) => setPreferences({ ...preferences, job_type: e.target.value })} />
          </div>
          <button type="submit">Add User</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
