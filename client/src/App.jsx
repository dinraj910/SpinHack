import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Wheel } from "react-custom-roulette";

const data = [
  { option: "Apple badminton racket" },
  { option: "Tesla flower vase" },
  { option: "Netflix detergent" },
  { option: "Microsoft slippers" },
  { option: "Tesla pressure cooker" },
  { option: "Adobe noodles" },
  { option: "Spotify torchlight" },
  { option: "Gucci instant noodles" },
  { option: "BMW hair clip" },
  { option: "Samsung toothbrush" },
];

function App() {
  const [teamName, setTeamName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [spinData, setSpinData] = useState("");
  const [backend, setBackend] = useState("");
  const [buttonVisible, setButtonVisible] = useState(true);

  const handleSpinClick = () => {
    if (teamName.trim() === '' || members.length === 0) {
      alert("Please fill both Team Name and Members.");
      return;
    }

    const userConfirm  = window.confirm("Are you sure you want to spin the wheel?");
    if (!userConfirm) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    setPrizeNumber(randomIndex);
    setSpinData(data[randomIndex].option); // Just for local display
    setMustSpin(true); // Trigger the wheel
  };

  const handleAddMember = () => {
    if (teamName.trim() !== '' && memberName.trim() !== '') {
      setMembers([...members, memberName.trim()]);
      setMemberName('');
    } else {
      alert("Please fill both Team Name and Member Name.");
    }
  };

  const checkTeamName = async () => {
    try {
      const response = await axios.post(
        'https://spinhack-1.onrender.com/api/checkteam',
        { teamName },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.exists) {
        alert("Team name already exists");
        setTeamName("");
      } else {
        console.log("Team name available");
      }
    } catch (err) {
      console.error(err);
      alert("Please Enter a Team Name");
    }
  };

  const handleDeleteMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🎡 SpinHack</h2>

      <div className="form-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          onBlur={checkTeamName}
        />
      </div>

      <div className="form-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Team Member Name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
        />
      </div>

      <div className="d-flex justify-content-center">
        <button className="btn btn-primary mb-3" onClick={handleAddMember}>
          ➕ Add Member
        </button>
      </div>

      {members.length > 0 && (
        <div className="card bg-dark text-white mt-4 p-3">
          <h5>Team Members</h5>
          <ul className="list-group list-group-flush">
            {members.map((member, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-bottom"
              >
                {member}
                <button
                  className="btn btn-sm btn-danger delete-btn"
                  onClick={() => handleDeleteMember(index)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='mt-4'>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          backgroundColors={[
            "#ff6b6b",
            "#1dd1a1",
            "#feca57",
            "#54a0ff",
            "#5f27cd",
            "#ee5253",
            "#48dbfb",
            "#73a2d4ff",
            "#f368e0",
            "#10ac84",
          ]}
          textColors={["#ffffff"]}
          outerBorderColor="#ffffff"
          outerBorderWidth={6}
          radiusLineWidth={3}
          radiusLineColor="#ffffff"
          fontSize={16}
          perpendicularText={false}
          textDistance={55}
          onStopSpinning={async () => {
            setMustSpin(false);
            const topic = data[prizeNumber].option;
            try {
              const response = await axios.post(
                'https://spinhack-1.onrender.com/api/spin',
                {
                  teamName: teamName,
                  members: members,
                  topic: topic,
                },
                {
                  headers: {
                    "Content-Type": "application/json"
                  }
                }
              );
              if (response.data) {
                console.log(response.data);
                setBackend(response.data);
                setButtonVisible(false);
              }
            } catch (err) {
              console.error("Error:", err);
              alert("Team Already Registered, You can't Spin Again");
            }
          }}
        />

        {buttonVisible ? (
          <button
            onClick={handleSpinClick}
            disabled={mustSpin}
            className="btn btn-warning btn-lg px-5"
          >
            {mustSpin ? "Spinning..." : "🎯 SPIN"}
          </button>
        ): null}

        {/* <button
          onClick={handleSpinClick}
          disabled={mustSpin}
          className="btn btn-warning btn-lg px-5"
        >
          {mustSpin ? "Spinning..." : "🎯 SPIN"}
        </button> */}

        {backend && !mustSpin && (
          <h2 className="mt-4 text-success">
            🎉 Topic: <span style={{ color: "white" }}>{backend.topic}</span>
          </h2>
        )}
      </div>
    </div>
  );
}

export default App;
