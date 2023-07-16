import React, { useState } from 'react';
import './App.css';
import logo from './assets/winlogo.png';
import CreateCampaign from './components/CreateCampaign/CreateCampaign';
import CampaignResults from './components/CampaignResults/CampaignResults';
var App = function () {
    var _a = useState('createTest'), currentTab = _a[0], setCurrentTab = _a[1];
    return (React.createElement("div", { className: "app" },
        React.createElement("header", { style: { textAlign: 'left' } },
            React.createElement("h1", null,
                React.createElement("img", { src: logo, alt: "WinAb logo", style: { height: '100px', width: '100px' } }),
                React.createElement("span", null, "Win"),
                React.createElement("span", null, "Ab"))),
        React.createElement("nav", null,
            React.createElement("div", { className: "tab ".concat(currentTab === 'createTest' ? 'active' : ''), onClick: function () { return setCurrentTab('createTest'); } }, "Create A Campaign"),
            React.createElement("div", { className: "tab ".concat(currentTab === 'testResult' ? 'active' : ''), onClick: function () { return setCurrentTab('testResult'); } }, "Campaign Details")),
        React.createElement("div", { className: "tab-content" },
            currentTab === 'createTest' && React.createElement(CreateCampaign, { setCurrentTab: setCurrentTab }),
            currentTab === 'testResult' && React.createElement(CampaignResults, null),
            currentTab === 'success' && React.createElement("h2", null, "Campaign created successfully!"),
            currentTab === 'error' && React.createElement("h2", null, "Failed to create campaign"))));
};
export default App;
