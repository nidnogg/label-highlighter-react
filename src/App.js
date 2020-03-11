import React, { useState, useEffect, useRef } from 'react';
import './css/App.css';

const App = () => {
  const [isSelecting, toggleSelecting] = useState(0);

  const isSelectingCallback = () => {
    return isSelecting;
  }

  const toggleSelectingCallback = value => {
    toggleSelecting(value);
  }

  return (
    <section className="main">
      <div className="main-header">
        <h3> 
          label highlighter   
        </h3>
      </div>
      <br/>
      <div className="main-content">
        <TextArea isSelecting={isSelectingCallback} toggleSelecting={toggleSelectingCallback} />
        <Labeller isSelecting={isSelectingCallback} toggleSelecting={toggleSelectingCallback} />
      </div>
    </section>
  );
}

const Labeller = props => {
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

  const selectionClassName = () => {
    
  }

  const renderLabels = listLabels.map((label) => 
      <li key={label} className={props.isSelecting() ? "label-entry selected" : "label-entry"} >
        {label + ':'}
        <button className="delete-button" onClick={ event => { event.preventDefault(); handleDeletion(label) } }>x</button>
      </li>
      );
  
  const renderContent = listLabels.map(() => 
    <li className="content-entry" >
      placeholder
      <button onClick={() => {
      if(!props.isSelecting()) {
        props.toggleSelecting(1);
        console.log('toggle selecting to ' + props.isSelecting());
      } else {
        props.toggleSelecting(0);
      }
    }}> select</button>
    </li>
  );

  useEffect(() => {
    console.log("listLabels:" + listLabels);
  });

  return (
    <section className="labeller">
      <section className="label-table">
      <h2>labels</h2>
        <form ref={formResetRef} onSubmit={handleSubmit}>
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

      <section className="content-table">
      <h2 className="content-header">contents</h2>
        <ul>
          <li><br/></li>
          {renderContent}
        
        </ul>
      </section>
    </section>
  );
}

const TextArea = props => {
  const [showTextSelection, setTextSelection] = useState([]);
  const handleMouseUp = () => {
    if(props.isSelecting()) {
      if(window.getSelection().toString().length < 2 || window.getSelection().toString() == ' ') {
        console.log('Selected empty or insufficient text!');
      } else {
        console.log('Selected text: ' + window.getSelection().toString());
      }
    }
  }

  return (
    <section className="textArea">
      <h2>textArea</h2>
      <p onMouseUp={handleMouseUp} className="text-content">
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