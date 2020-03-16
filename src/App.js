import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Labeller from './Labeller.js';
import TextArea from './TextArea.js';
import './css/App.css';

const App = () => {

  // SelectedText holds a map() containing all highlight contents for each label created by the user
  const [selectedText, updateSelectedText] = useState(new Map());

  // SelectedTextNode holds a map() containing all highlighted DOM nodes,
  // for each label created by the user, intended for use in a library such as BeautifulSoup
  const [selectedTextNode, updateSelectedTextNode] = useState(new Map());
  
  // isSelecting refers to the currently selected label, and is used to assign any current highlights to that label.
  const [isSelecting, toggleSelecting] = useState(null);

  // GSAP timeline used for animating some main elements
  const tl = useRef(0);
  const mainHeader = useRef(0);
  const mainContent = useRef(0);

  // These callbacks are all passed down to child components so that the state is actually managed in the App component.
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
  }, []); // Requirement for using hooks with timelines
  
  useEffect(() => {
    tl.current.play();
  }, []);  
  
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