const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const  Team = require('./models/Team');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URL;

mongoose.connect(MONGO_URI, {
})
.then(() => console.log("MongoDB Connected ✅✅✅"))
.catch(err => console.error("MongoDB Connection Failed:", err));

//  API 1: Check if a team already registered (GET)

app.get('/api/check/:teamName', async (req, res) => {
  const teamName = req.params.teamName.toLowerCase();
  const team = await Team.findOne({ teamNameLower: teamName });

  if (team) {
    res.status(200).json({
      exists: true,
      topic: team.topic
    });
  } else {
    res.status(200).json({ exists: false });
  }
});

// API 2: Register team and selected topic (POST)
app.post('/api/spin', async (req, res) => {
  try {
    const { teamName, members, topic } = req.body;

    const teamNameLower = teamName.toLowerCase();

    const already = await Team.findOne({ teamNameLower });
    if (already) {
      return res.status(409).json({
        message: "Team already registered",
        topic: already.topic
      });
    }

    const newTeam = new Team({
      teamName,
      teamNameLower,
      members,
      topic
    });

    await newTeam.save();

    res.status(201).json({ message: "Team registered successfully", topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// API 3: Check team name availability
app.post('/api/checkteam', async (req, res) => {
  try {
    const { teamName } = req.body;

    if (!teamName || typeof teamName !== 'string') {
      return res.status(400).json({ message: "Invalid team name" });
    }

    const teamNameLower = teamName.toLowerCase();

    const team = await Team.findOne({ teamNameLower });

    if (team) {
      return res.status(200).json({
        exists: true,
        topic: team.topic,
        members: team.members,
        teamName: team.teamName,
        message: "Team already registered"
      });
    } else {
      return res.status(200).json({ exists: false,message: "Team not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} ✅✅✅`);
})

