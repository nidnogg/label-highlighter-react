import React, { useState, useEffect, useRef } from 'react';
import './css/App.css';

const App = () => {
  const [selectedText, updateSelectedText] = useState(new Map());
  const [selectedTextNode, updateSelectedTextNode] = useState(new Map());

  const [isSelecting, toggleSelecting] = useState(null);

  const selectedTextCallback = labelName => {
    return selectedText;
  }

  const updateSelectedTextCallback = (labelName, newContent, replaceFlag) => {
    if(selectedText) {
      if(selectedText.has(labelName)) {
        if(!replaceFlag) {
          let updatedContent = selectedText.get(labelName).concat([newContent]);
          updateSelectedText(selectedText.set(labelName, updatedContent));
          
          // clone
          let updatedContentPosition = selectedText.get(labelName).concat([newContent]);
          updateSelectedTextNode(selectedTextNode.set(labelName, updatedContentPosition));
        } else {
          updateSelectedText(selectedText.set(labelName, newContent));
                    // clone

          updateSelectedTextNode(selectedTextNode.set(labelName, newContent));
        }
      } else {
        updateSelectedText(selectedText.set(labelName, [newContent]));
                  // clone

        updateSelectedTextNode(selectedTextNode.set(labelName, [newContent]));
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
      props.updateSelectedText(label, [], true);
      let spanNodes = document.getElementsByClassName(`${label} tooltip`);
      let spanTooltipNodes = document.getElementsByClassName(`${label} tooltiptext`);
      
      while (spanNodes.length > 0) {
        console.log(`Deleting: spanNodes[0] = ${spanNodes[0]}`);
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

  const renderLabels = listLabels.map((label) => 
      <li key={generateKey(label)} className={props.isSelecting() == label ? "label-entry selected" : "label-entry"} >
        {label + ':'}
        <button className="delete-button" onClick={ event => { event.preventDefault(); handleDeletion(label) } }>x</button>
      </li>
      );
  
  const renderContent = listLabels.map(label => 
    <li key={generateKey(label)} className="content-entry" >
      {/*<span contentEditable="true">*/}
      <span>
        {props.selectedText().has(label) ? printContent(props.selectedText().get(label)) : 'Select a phrase or word from the left-most area'}
      </span>
      <button onClick={() => {
        if(!props.isSelecting() || props.isSelecting() === label) {
          props.toggleSelecting(label);
        } else {
          props.toggleSelecting(null);
        }
      }}>
      select
      </button>
    </li>
  );

  useEffect(() => {
    //console.log(`${props.isSelecting()} is selecting!`);
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
    let modifiedContent = props.selectedText().get(label);
    modifiedContent = modifiedContent.filter(item => item !== stringToDelete);
    props.updateSelectedText(label, modifiedContent, true);
  }

  // Re-renders labeller component by toggling its state rapidly
  const flushLabeller = () => {
    props.toggleSelecting(null);
          setTimeout(() => { 
            props.toggleSelecting(labelRefresh);
          }, 0.5);
  } 

  let labelRefresh = props.isSelecting();
    
  const deleteLabelNode = (node, label) => {
    for (let nodeChild of node.childNodes) {
      if(nodeChild.nodeType != Node.TEXT_NODE) {
        // Remove the actual child DOM node if it's not a text node
        //console.log(`node to remove ${node}`);
        node.removeChild(nodeChild);
        node.outerHTML = node.innerHTML;
        deleteSelectionStateText(node.innerText, label);
        flushLabeller();
      } 
    }
  }

  const clearSelection = () => {
    if (window.getSelection) { window.getSelection().removeAllRanges(); }
    else if (document.selection) { document.selection.empty(); }
  }


  const handleMouseUp = () => {
    let label = props.isSelecting();
   
    if(label) {
      let textHighlight = window.getSelection().toString();
      if(textHighlight.length < 1 || textHighlight == ' ') {
        console.log('Selected empty or insufficient text!');
      } else {
        let range = window.getSelection().getRangeAt(0);
        let selectionContents = range.extractContents();
        
        let span = document.createElement("span");
        let spanTooltip = document.createElement("span");

        span.style.backgroundColor = "black";

        span.className = `${label} ${generateKey(label)} tooltip`;
        span.appendChild(selectionContents);

        spanTooltip.className = `${label} tooltiptext no_highlighting`;
        spanTooltip.innerText = "Click to remove from label";

        span.onclick = () => {
          deleteLabelNode(span, label);
        }
    
        // In the case of an overlap - check for child span nodes (Non text nodes!)
        if(span.children.length > 0) {
          console.log('overlapped!');
          for (let node of span.childNodes) {
            if(node.nodeType != Node.TEXT_NODE) {
              // Remove the actual child DOM node if it's not a text nnode
              console.log(`node to remove ${node.childNodes.item(1)}`);
              deleteLabelNode(node, label);
            }
          }
          
          // Append the broader selection to the highlights.
          span.appendChild(spanTooltip);

          range.insertNode(span);
          props.updateSelectedText(label, textHighlight, false);
          props.toggleSelecting(null);
          clearSelection();
                   
        } else { // Append a new selection to highlighted text
          //span.appendChild(selectionContents);
          span.appendChild(spanTooltip);
  
          range.insertNode(span);
          props.updateSelectedText(label, textHighlight, false);
          flushLabeller();
          
          clearSelection();
        }
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

// Hooks and helpers
const useForceUpdate = () => {
  const [, setIt] = useState(false);
  return () => setIt(it => !it);
};

const generateKey = pre => {
  return `${ pre }_${ new Date().getTime() }`;
}

const printContent = contentObjArr => {
  let toPrint = contentObjArr[0];
  if(contentObjArr.length > 1) {
    for (let index = 1; index < contentObjArr.length; index++) {
      toPrint = toPrint.concat(`; ${contentObjArr[index]}`);
    }
  } 
  return toPrint;
}

export default App;