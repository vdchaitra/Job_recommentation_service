const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


const UserProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    skills: { type: [String], required: true },
    experience_level: { type: String, required: true }, 
    preferences: {
        desired_roles: { type: [String], required: true },
        location: { type: [String], required: true },
        job_type: { type: String, required: true }
    }
});

const JobPostingSchema = new mongoose.Schema({
    job_title: { type: String, required: true },
    company: { type: String, required: true },
    required_skills: { type: [String], required: true },
    location: { type: String, required: true },
    job_type: { type: String, required: true },
    experience_level: { type: String, required: true }
    
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
const JobPosting = mongoose.model('JobPosting', JobPostingSchema);

app.post('/api/users', async (req, res) => {
    const userProfile = new UserProfile(req.body);
    try {
        await userProfile.save();
        res.status(201).send(userProfile);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Error creating user profile', error });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await UserProfile.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving users', error });
    }
});

app.post('/api/jobs', async (req, res) => {
    const jobPosting = new JobPosting(req.body);
    try {
        await jobPosting.save();
        res.status(201).send(jobPosting);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Error creating job posting', error });
    }
});

const recommendJobs = (userProfile, jobPostings) => {
    if (!userProfile || !userProfile.skills || !Array.isArray(userProfile.skills)) {
        return [];
    }

    const preferences = userProfile.preferences || {};
    const locations = preferences.location || [];
    const jobtitle = preferences.desired_roles || [];
    const jobtype = preferences.job_type || [];

    if (!Array.isArray(locations)) {
        console.error("User's preferred locations is not an array:", locations);
        return [];
    }

    const recommendations = jobPostings.filter(job => {
        const allSkillsMatch = userProfile.skills.map(skill => skill.toLowerCase()).some(skill =>
            job.required_skills.map(reqSkill => reqSkill.toLowerCase()).includes(skill)
        );

        const experienceMatches = userProfile.experience_level.toLowerCase() === job.experience_level.toLowerCase();

        const locationMatches = locations.some(preference =>
            job.location.toLowerCase().includes(preference.toLowerCase())
        );

        const jobtypeMatch = jobtype.toLowerCase() === job.job_type.toLowerCase();

        const jobtitleMatches = jobtitle.some(preference => 
            job.job_title.toLowerCase().includes(preference.toLowerCase())
        );

        return allSkillsMatch && experienceMatches && locationMatches && jobtitleMatches && jobtypeMatch;
    });

    return recommendations;
};



app.get('/api/recommendations/:userId', async (req, res) => {
    try {
        const user = await UserProfile.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const jobs = await JobPosting.find();
        const recommendations = recommendJobs(user, jobs); 

        res.json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error retrieving job recommendations', error: err });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
