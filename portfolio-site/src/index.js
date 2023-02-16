import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Board from './board.js';
  
  class App extends React.Component {

    render() {
      return (
        <div className="app">
          <div className="headerbar">
            header here
          </div>
            <Board />
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
  