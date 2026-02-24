import React, { useState } from 'react';
import Navbar from "./components/NavBar";
import Home from './pages/Home';
import Generator from './pages/Generator';

export default function App(){
  const [currentPage, setCurrentPage] = useState('home');
  
  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'home' ? (
        <Home setCurrentPage={setCurrentPage} />
      ) : (
        <Generator />
      )}
    </>
  );
  
}