import React, { useState, useEffect, useRef } from 'react';
import './css/App.css';
import { generateKey } from './helpers.js';

const TextArea = props => {
  
  // These two states handle color assignments to each label
  const [labelColors, updateLabelColor] = useState(new Map());
  const [getColorFromPalette, updateColorPalette] = useState({palette: paletteArray, index: 0});

  const getLabelColor = label => {
    //If the label already has a color assigned to it
    if(labelColors.get(label) !== undefined) {
      return labelColors.get(label);
    }
    let index = getColorFromPalette.index;
    let outputColor = getColorFromPalette.palette[index];
    updateColorPalette({palette: paletteArray, index: index+=1});
    updateLabelColor(labelColors.set(label, outputColor));
    return labelColors.get(label);
  }

  // Re-renders labeller component by toggling its state rapidly
  const flushLabeller = () => {
    props.toggleSelecting(null);
          setTimeout(() => { 
            props.toggleSelecting(previousLabel);
          }, 0.5);
  } 

  let previousLabel = props.isSelecting();
    
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
        node.removeChild(nodeChild);
        node.outerHTML = node.innerHTML;
        deleteSelectionStateText(node.innerText, node, label);
        flushLabeller();
      } 
    }
  }

  // Clears mouse selection after highlighting
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
        
        // Surround highlights with span and a span tooltip child. Both the contents and the actual dom nodes 
        // are stored in their respective states so that the app can pass these to a dedicated back-end and
        // retrieve them afterwards, with libraries such as beautifulSoup
        let span = document.createElement("span");
        let spanTooltip = document.createElement("span");

        span.style.backgroundColor = getLabelColor(label);
        span.className = `${label} ${generateKey(label)} tooltip`;
        span.appendChild(selectionContents);

        spanTooltip.className = `${label} tooltiptext`;
        spanTooltip.innerText = "Click to remove from label";

        span.onclick = () => {
          deleteLabelNode(span, label);
        }
    
        // In the case of an overlap - check for child span nodes (Non text nodes!)
        if(span.children.length > 0) {
          console.log('overlapped!');
          for (let node of span.childNodes) {
            if(node.nodeType != Node.TEXT_NODE) {
              // Remove the actual child DOM nodes if they're not text nodes
              deleteLabelNode(node, label);
            }
          }
          
          // Then finally append the broader selection to the highlights
          span.appendChild(spanTooltip);

          range.insertNode(span);
          props.updateSelectedText(label, textHighlight, span, false);
          props.toggleSelecting(null);
          flushLabeller();
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
      <h2 className="no-highlighting">Sample Text</h2>
        <p onMouseUp={handleMouseUp} className="text-content">
          The bucket soaked in mineral water of Zöndgernopd 
          Mixed with a dosage of Zöndgernopd prepared from their 
          Sulfur by the latest chemical techniques. When mixed with 
          several pounds of solvent, and operated over a long period 
          of time,this mixture produces an almost homogenous mixture 
          of some hundreds of poisons that are thought to have been 
          left behind on the planet.
        </p>

      <section className="user-help">
        <h2 className="no-highlighting">Hover for instructions</h2>
        <ol className="text-content user-help-content"> 
          <li>
            Click on Add Label to type in a label name, and then click the + button on the right to add that label
          </li>
          <li>
            Select labels by clicking on their names.
          </li>
          <li>
            Once created, the label is automatically selected, and you can click and drag over a piece of text to assign that selection to that label.
          </li>
          <li>
            To remove a label, try clicking on a highlighted section.
          </li>
          <li>
            Label contents can be edited!
          </li>
        </ol>
    
      </section>
    </section>
  );
} 

const paletteArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

export default TextArea;