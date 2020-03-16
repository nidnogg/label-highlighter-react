import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './css/App.css';
import { generateKey, printContent } from './helpers.js';

const Labeller = props => {
  // Contains references to all labels created by the user
  const [listLabels, setListLabels] = useState([]);

  // For handling form inputs
  const [value, setValue] = useState(0);

  //0 is for fadeout, 1 is for fadeIn
  const [fade, setFade] = useState(0); 
  
  const formResetRef = useRef(0);

  const handleSubmit = event => {
    event.preventDefault();
    
    // For fading label list items via CSSTransition and TransitionGroup
    setFade(1);

    // Sanitizes user label name input
    if(value == '') {
      alert('Empty label detected!');
    }
    else if(!listLabels.includes(value)) {
      setListLabels( listLabels.concat(value) );   
    }
    else {
      alert('Duplicate label detected!');
    }

    //  Clears value from input after submitting 
    formResetRef.current.reset();

    // Sets the most recently created label as the selecting one 
    props.toggleSelecting(value);

  }

  const handleChange = event => {
    setValue(event.target.value);
  }

  const handleDeletion = label => {
    const labelToRemove = label;
    props.toggleSelecting('');
    setValue('');
    deleteLabelHighlights(label);
    setListLabels(listLabels.filter(item => item != labelToRemove ));
  }

  const deleteLabelHighlights = label => {
    if(props.selectedText()) {
      props.updateSelectedText(label, [], [], true);
      let spanNodes = document.getElementsByClassName(`${label} tooltip`);
      let spanTooltipNodes = document.getElementsByClassName(`${label} tooltiptext`);
      
      while (spanNodes.length > 0) {
        if(spanTooltipNodes[0].parentNode) {
          spanTooltipNodes[0].parentNode.removeChild(spanTooltipNodes[0]);
          spanNodes[0].outerHTML = spanNodes[0].innerHTML;
        }
      }
    }
    else {
      return;
    }
  }

  const renderLabels = listLabels.map(label => 
      <CSSTransition in={fade} timeout={200} classNames="fade-animations">
        <li key={generateKey(label)} className={props.isSelecting() == label ? "label-entry label-text selected" : "label-entry"} >
          <div className="label-wrapper" onClick={() => {
                                          if(props.isSelecting() == label) {
                                            props.toggleSelecting(null);
                                          } else {
                                            props.toggleSelecting(label);
                                          }
                                          }}>
            {label + ':'}
          </div>
          <button className="delete-button" onClick={ event => { event.preventDefault(); setFade(0); handleDeletion(label); } }>x</button>
        </li>
      </CSSTransition>
      );
  
  const renderContent = listLabels.map(label => 
      <li key={generateKey(label)} className="content-entry" >
        <span contentEditable="true">
          {props.selectedText().has(label) ? printContent(props.selectedText().get(label)) : ''}
        </span>
      </li>
  );

  return (
    <section className="labeller">
      <section className="label-table">
      <h2>labels</h2>
        <form ref={formResetRef} onSubmit={handleSubmit}>
          <ul>
              <li className="label-entry">
                <input className="initial-input" name="addButton" type="text" placeholder="Add new Label" onChange={handleChange}/>
                <button className="add-button" type="submit">+</button>
              </li>
              <TransitionGroup> 
                {renderLabels}
              </TransitionGroup>
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

export default Labeller;