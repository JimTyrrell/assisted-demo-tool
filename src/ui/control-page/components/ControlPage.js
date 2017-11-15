import React, { Component } from 'react';

import HorizontalDemoListContainer from '../containers/HorizontalDemoListContainer.js';
import CloseButton from './CloseButton.js';
import SetupDemoButton from '../containers/SetupDemoButtonContainer.js';

import './ControlPage.css';

class ControlPage extends Component {
  render() {
    let className = ['ControlPage'];

    return (
      <div className={className.join(' ')}>
        <div className="header">
          <div className="header-left">
            <HorizontalDemoListContainer />
          </div>
          <div className="header-right">
            <SetupDemoButton />
            <CloseButton />
          </div>
        </div>
        <div className="small-row" />
        <div className="main-content" />
      </div>
    );
  }
}

export default ControlPage;
