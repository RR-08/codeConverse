import React from 'react';
import '../styles/Home.scss';
import Navbar from '../components/Home/Navbar';
import Showcase from '../components/Home/Showcase';

function Home() {
  return (
    <>
      <div className="background">
        <div className="overlay"></div>
        <div className="main-area">
          <Navbar />
          <Showcase />
        </div>
      </div>
    </>
  )
}

export default Home;