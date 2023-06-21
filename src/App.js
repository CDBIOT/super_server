import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';


import Navbar from './components/Navbar';

import Home from './components/pages/Home';

function App() {
  


  return (
   
<div className='App'>
<Router>
    <Navbar />

         <Routes>
            <Route exact path="/"       element={<Home/>}></Route>
         </Routes>
    </Router>


</div>
  
  );
  }

export default App;
