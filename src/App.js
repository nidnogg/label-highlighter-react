import React, { useState, useEffect, useRef } from 'react';
import Labeller from './Labeller.js';
import TextArea from './TextArea.js';
import './css/App.css';

const App = () => {
  const [selectedText, updateSelectedText] = useState(new Map());
  const [selectedTextNode, updateSelectedTextNode] = useState(new Map());
  const [isSelecting, toggleSelecting] = useState(null);

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