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

  const formResetRef = useRef(0);
  const handleSubmit = event => {
    event.preventDefault();
    setListLabels( listLabels.concat(value) );   

    //  Clears value from input after submitting
    formResetRef.current.reset();
  }

  const handleChange = event => {
    setValue(event.target.value);
  }

  const handleDeletion = label => {
    const labelToRemove = label;
    setListLabels(listLabels.filter(item => item != labelToRemove ));
  }

  const renderLabels = listLabels.map((label) => 
      <li key={label} className="label-entry">
        {label}
        <button className="delete-button" onClick={ event => { event.preventDefault(); handleDeletion(label) } }>x</button>
      </li>
      );
  
  useEffect(() => {
    console.log("listLabels:" + listLabels);
  });

  return (
    <section className="labeller">
      <h2>labeller</h2>
      <form className="label-table" ref={formResetRef} onSubmit={handleSubmit}>
        {/* */}
        <ul>
            <li className="label-entry">
              <input className="initial-input" name="addButton" type="text" placeholder="Add new Label" onChange={handleChange}/>
              <button className="add-button" type="submit">+</button>
            </li>
            {renderLabels}
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