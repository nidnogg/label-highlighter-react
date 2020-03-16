import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Labeller from './Labeller.js';
import TextArea from './TextArea.js';
import './css/App.css';

const App = () => {
  const [selectedText, updateSelectedText] = useState(new Map());
  const [selectedTextNode, updateSelectedTextNode] = useState(new Map());
  const [isSelecting, toggleSelecting] = useState(null);

  
  const tl = useRef(0);
  const mainHeader = useRef(0);
  const mainContent = useRef(0);
  const selectedTextCallback = labelName => {
    return selectedText;
  }

  const updateSelectedTextCallback = (labelName, newContent, newNode, replaceFlag) => {
    if(selectedText) {
      if(selectedText.has(labelName)) {
        if(!replaceFlag) {
          let updatedContent = selectedText.get(labelName).concat([newContent]);
          updateSelectedText(selectedText.set(labelName, updatedContent));
          
          // clone
          let updatedContentNode = selectedTextNode.get(labelName).concat([newNode]);
          updateSelectedTextNode(selectedTextNode.set(labelName, updatedContentNode));
        } else {
          updateSelectedText(selectedText.set(labelName, newContent));
          // clone
          updateSelectedTextNode(selectedTextNode.set(labelName, newNode));
        }
      } else {
        updateSelectedText(selectedText.set(labelName, [newContent]));
        // clone
        updateSelectedTextNode(selectedTextNode.set(labelName, [newNode]));
      }
    }
  }

  const selectedTextNodeCallback = labelName => {
    return selectedTextNode;
  }

  const isSelectingCallback = () => {
    return isSelecting;
  }

  const toggleSelectingCallback = value => {
    toggleSelecting(value);
  }
  
  useEffect(() => {
    if(!tl.current) {
      tl.current = gsap.timeline({defaults: {duration: 0.377, ease:"expo"} })
      .to(mainHeader.current, {top: "-20px", opacity: "1"})
      .to(mainContent.current, {opacity: "1"}, "0.5")
    }
  }, []); // crap requirement for using hooks with timelines
  
  useEffect(() => {
    tl.current.play();
  }, []);  
  
  /*
  */
  return (
    <section className="main">
      <div ref={mainHeader} className="main-header">
        <h1> 
          label highlighter   
        </h1>
      </div>
      <br/>
      <div ref={mainContent} className="main-content">
        <TextArea isSelecting={isSelectingCallback} toggleSelecting={toggleSelectingCallback} 
                  selectedText={selectedTextCallback} updateSelectedText={updateSelectedTextCallback}
                  selectedTextNode={selectedTextNodeCallback}

        />
        <Labeller isSelecting={isSelectingCallback} toggleSelecting={toggleSelectingCallback} 
                  selectedText={selectedTextCallback} updateSelectedText={updateSelectedTextCallback}
        />
      </div>
    </section>
  );
}

export default App;