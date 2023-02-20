import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './css/index.css';
import Layout from './templates/layout.js';
import MainPage from './templates/home.js';
import Collection from './templates/collection.js';

import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

  
  const App=()=> {

    return (
      <BrowserRouter>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<MainPage />} />
                <Route path="/collection/*" element={<Collection />} />
              </Route>
            </Routes>
      </QueryParamProvider>
    </BrowserRouter>
  );
    
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
  