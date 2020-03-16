import React, { useState, useEffect, useRef } from 'react';
import './css/App.css';
import { generateKey, printContent } from './helpers.js';

const TextArea = props => {
  
  // Re-renders labeller component by toggling its state rapidly
  const flushLabeller = () => {
    props.toggleSelecting(null);
          setTimeout(() => { 
            props.toggleSelecting(labelRefresh);
          }, 0.5);
  } 

  let labelRefresh = props.isSelecting();
    
  const deleteSelectionStateText = (stringToDelete, nodeToDelete, label) => {
    let modifiedContent = props.selectedText().get(label);
    modifiedContent = modifiedContent.filter(item => item !== stringToDelete);
    
    let modifiedContentNode = props.selectedTextNode().get(label);
    modifiedContentNode = modifiedContentNode.filter(item => item !== nodeToDelete);
    props.updateSelectedText(label, modifiedContent, modifiedContentNode, true);
  }

  const deleteLabelNode = (node, label) => {
    for (let nodeChild of node.childNodes) {
      if(nodeChild.nodeType != Node.TEXT_NODE) {
        // Remove the actual child DOM node if it's not a text node
        //console.log(`node to remove ${node}`);
        node.removeChild(nodeChild);
        node.outerHTML = node.innerHTML;
        deleteSelectionStateText(node.innerText, node, label);
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
              deleteLabelNode(node, label);
            }
          }
          
          // Append the broader selection to the highlights.
          span.appendChild(spanTooltip);

          range.insertNode(span);
          props.updateSelectedText(label, textHighlight, span, false);
          props.toggleSelecting(null);
          clearSelection();
                   
        } else { 
          // Append a new selection to highlighted text
          span.appendChild(spanTooltip);
  
          range.insertNode(span);
          props.updateSelectedText(label, textHighlight, span, false);
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

export default TextArea;