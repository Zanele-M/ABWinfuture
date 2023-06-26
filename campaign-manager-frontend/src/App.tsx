import React, { useState } from 'react';
import './App.css';
import CreateTest from './components/CreateTest/CreateTest';
import logo from './assets/winlogo.png';
import CampaignResults from './components/CampaignResults/CapaignResults';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('createTest');

  return (
    <div className="app">
      <header style={{textAlign: 'left'}} >
        <h1>
          <img src={logo} alt="WinAb logo" style={{height: '100px', width: '100px'}} />
          <span>Win</span>
          <span>Ab</span>
        </h1>
      </header>

      <nav>
        <div
          className={`tab ${currentTab === 'createTest' ? 'active' : ''}`}
          onClick={() => setCurrentTab('createTest')}
        >
          Create A Campaign
        </div>
        <div
          className={`tab ${currentTab === 'testResult' ? 'active' : ''}`}
          onClick={() => setCurrentTab('testResult')}
        >
          Campaign Details
        </div>
      </nav>

      <div className="tab-content">
        {currentTab === 'createTest' && <CreateTest setCurrentTab={setCurrentTab} />}
        {currentTab === 'testResult' && <CampaignResults />}
        {currentTab === 'success' && <h2>Test created successfully!</h2>}
        {currentTab === 'error' && <h2>Failed to create test</h2>}
      </div>
    </div>
  );
};

export default App;
