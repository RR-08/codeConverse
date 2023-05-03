import React from 'react';
import '../../styles/Navbar.scss';

function Navbar() {
  return (
    <div id="navbar">
      <div className="container">
        <div className="nav-inner">
          <a href="/" id="nav-logo">&#60;Code/Converse&#62;</a>
          <div id="menu">
            <ul className="menu-list">
              <li className="menu-item">
                <a href="https://github.com/vrinda-mahajan/codeConverse" target="_blank" rel="noreferrer">
                  <i className="fab fa-github"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;