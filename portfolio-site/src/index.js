import React, {useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './css/index.css';
import Board from './board.js';
import Header from './header.js';
import entries from './data.json';
import Layout from './templates/layout.js';
import MainPage from './templates/home.js';
import Collection from './templates/collection.js';

  
  const App=()=> {

    return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/collection/*" element={<Collection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
    
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
  