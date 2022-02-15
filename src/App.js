import Home from "./Component/Home";
import Saved from "./Component/Saved";
import Removed from "./Component/Removed";
import {  BrowserRouter as Router,  Routes,  Route} from "react-router-dom";

import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
     <Router>
        <Routes>
          <Route path="/" exact element={ <Home/> } />
          <Route exact path="/saved" element={<Saved/>} />
          <Route exact path="/ignored" element={<Removed/>} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
