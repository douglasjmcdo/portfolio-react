import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './css/index.css';
import './css/fonts.css';
import './css/colors.css';
import Layout from './templates/layout.js';
import MainPage from './templates/home.js';
import Collection from './templates/collection.js';
import Documentation from './templates/documentation';

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
                <Route path="/documentation/*" element={<Documentation />} />
              </Route>
            </Routes>
      </QueryParamProvider>
    </BrowserRouter>
  );
    
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
  