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
  const [listLabels, setListLabels] = useState([]);
  const [value, setValue] = useState(0);

  const addItem = e => {
    e.preventDefault();
    console.log("onSubmit called, current listLabels state is: " + listLabels);
    return;
  }

  const handleInput = e => {
    //setListLabels(listLabels.concat(e.target.value)); 
    //setListLabels([e.target.value, ]);
    return;
  }

  return (
    <section className="labeller">
      <h2>labeller</h2>
      <form className="label-table" onSubmit={addItem}>
        {/* */}
        <ul>
            <li className="label-entry label-entry-initial">
              <input type="text" placeholder="Add new Label" onChange={handleInput}/>
                <button type="submit">+</button>
            </li>
        </ul>        
      </form>
    </section>
  );
}

const TextArea = () => {
  return (
    <section className="textArea">
      <h2>textArea</h2>
      <p>
        The bucket soaked in mineral water of Zöndgernopd 
        Mixed with a dosage of Zöndgernopd prepared from their 
        Sulfur by the latest chemical techniques. When mixed with 
        several pounds of solvent, and operated over a long period 
        of time,this mixture produces an almost homogenous mixture 
        of some hundreds of poisons that are thought to have been 
        left behind on the planet.
      </p>
      
    </section>
  );
}

export default App;