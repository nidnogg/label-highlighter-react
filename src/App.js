import React, { useState, useEffect, useRef } from 'react';
import './css/App.css';

const App = () => {
  return (
    <section className="main">
      <div className="main-header">
        <h3> 
          label highlighter   
        </h3>
      </div>
      <br/>
      <div className="main-content">
        <TextArea />
        <Labeller />
      </div>
    </section>
  );
}

const Labeller = () => {
  return (
    <section className="labeller">
      <h2>labeller</h2>
    </section>
  );
}

const TextArea = () => {
  return (
    <section className="textArea">
      <h2>textArea</h2>
    </section>
  );
}

export default App;