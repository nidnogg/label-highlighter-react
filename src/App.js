import React, { useState, useEffect, useRef } from 'react';
import './css/App.css';

const App = () => {
  const [selectedText, updateSelectedText] = useState(new Map());
  const [isSelecting, toggleSelecting] = useState(null);

  const selectedTextCallback = labelName => {
    /*
    if(!selectedText.has(labelName)) {
      console.log('There is no selected text');
      return null;
    } else {
      */
    return selectedText;
  //  }
  }

  const updateSelectedTextCallback = (labelName, newContent) => {
    if(selectedText) {
      if(selectedText.has(labelName)) {
        let updatedContent = selectedText.get(labelName).concat([newContent]);
        updateSelectedText(selectedText.set(labelName, updatedContent));
      } else {
        updateSelectedText(selectedText.set(labelName, [newContent]));
      }
    }
  }

  const isSelectingCallback = () => {
    return isSelecting;
  }

  const toggleSelectingCallback = value => {
    toggleSelecting(value);
  }

  return (
    <section className="main">
      <div className="main-header">
        <h1> 
          label highlighter   
        </h1>
      </div>
      <br/>
      <div className="main-content">
        <TextArea isSelecting={isSelectingCallback} toggleSelecting={toggleSelectingCallback} 
                  selectedText={selectedTextCallback} updateSelectedText={updateSelectedTextCallback}
        />
        <Labeller isSelecting={isSelectingCallback} toggleSelecting={toggleSelectingCallback} 
                  selectedText={selectedTextCallback} updateSelectedText={updateSelectedTextCallback}
        />
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
  }

  const handleChange = event => {
    setValue(event.target.value);
  }

  const handleDeletion = label => {
    const labelToRemove = label;
    props.toggleSelecting('');
    setValue('');
    setListLabels(listLabels.filter(item => item != labelToRemove ));
  }

  const renderLabels = listLabels.map((label) => 
      <li key={generateKey(label)} className={props.isSelecting() == label ? "label-entry selected" : "label-entry"} >
        {label + ':'}
        <button className="delete-button" onClick={ event => { event.preventDefault(); handleDeletion(label) } }>x</button>
      </li>
      );
  
  const renderContent = listLabels.map(label => 
    <li key={generateKey(label)} className="content-entry" >
      <span contentEditable="true">
        {props.selectedText().has(label) ? printContent(props.selectedText().get(label)) : 'failed'}
        {/*props.selectedText()*/}
      </span>
      <button onClick={() => {
      if(!props.isSelecting()) {
        props.toggleSelecting(label);
      } else {
        props.toggleSelecting(null);
      }
    }}>select</button>
    </li>
  );

  useEffect(() => {
    console.log(props.isSelecting() + ' is selecting');
  });

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

  const deleteSelectionStateText = (stringToDelete, label) => {
    //console.log(stringToDelete);
    let modifiedContent = props.selectedText().get(label);
    modifiedContent = modifiedContent.filter(item => item !== stringToDelete);
    console.log(`Removed ${stringToDelete}, current content array: ${modifiedContent}`);
    props.selectedText().set(label, modifiedContent);
  }

  const handleMouseUp = () => {
    let label = props.isSelecting();
    if(label) {
      let textHighlight = window.getSelection().toString();
      if(textHighlight.length < 2 || textHighlight == ' ') {
        console.log('Selected empty or insufficient text!');
      } else {
        let range = window.getSelection().getRangeAt(0);
        let selectionContents = range.extractContents();
        
        let span = document.createElement("span");
        let spanTooltip = document.createElement("span");

        span.style.backgroundColor = "black";

        span.className = "tooltip";
        spanTooltip.className = "tooltiptext";
        spanTooltip.innerText = "Click to remove from label";

        span.onclick = () => {
          //span.outerHTML = span.innerHTML;
          span.removeChild(spanTooltip);
          span.outerHTML = span.innerHTML;
          deleteSelectionStateText(span.innerHTML, label);
        }
        span.appendChild(selectionContents);
        span.appendChild(spanTooltip);

        range.insertNode(span);
        props.updateSelectedText(label, textHighlight);
      }
    }
  }



  useEffect(() => { 
    //let label = props.isSelecting();
    //props.selectedText(label) ? printContent(props.selectedText(label)) : '';

  });
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

const generateKey = pre => {
  return `${ pre }_${ new Date().getTime() }`;
}

const printContent = contentObjArr => {
  console.log('INSIDE printContent');
  let toPrint = contentObjArr[0];
  if(contentObjArr.length > 1) {
    for (let index = 1; index < contentObjArr.length; index++) {
     // console.log(contentObjArr[index]);
      toPrint = toPrint.concat(`; ${contentObjArr[index]}`);
    }
  } 
  console.log(toPrint);
  return toPrint;
}

export default App;