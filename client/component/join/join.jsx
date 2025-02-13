import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './join.css';
import logo from '../../src/images/logo.png';

let user;

const sendUser = () => {
  user = document.getElementById('JoinInput').value;
  document.getElementById('JoinInput').value = ""
};

export default function Join() {

  const [name, setname] = useState("");
  return (
    <div className="JoinPage">
      <div className="JoinContainer">
        <img src={logo} alt="Logo" />
        <h1>ChatZilla</h1>
        <input type="text" onChange={(e)=>{
          setname(e.target.value)
        }} placeholder="Enter your name" id="JoinInput" />
        <Link  onClick={(e)=>{!name ? e.preventDefault() :null}} to="/chat">
          <button onClick={sendUser} className="join-btn">LOGIN IN</button>
        </Link>
      </div>
    </div>
  );
}

export { user }; 
