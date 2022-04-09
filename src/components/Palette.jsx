import React, { useContext } from 'react';
import { Link, PencilSimple, Eraser, FolderOpen, FloppyDisk } from "phosphor-react";
import styled, { ThemeContext } from 'styled-components';

import { useSelector, useDispatch } from 'react-redux'
import {
  selectScenes,
  setContent
} from '../features/sceneSlice'

const ToolWrapper = styled.div`
`

const Tools = styled.div`
  width: 40px;
  height: fit-content;
  margin: 1em 0 1em 0;
  border-radius: ${props => props.theme.radius};
  background-color: ${props => props.theme.surface};
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 10px;
   > * {
      margin-top: 10px;
      cursor: pointer;
   }
`

export default function Palette(props){  
  const themeContext = useContext(ThemeContext)
  const scenes = useSelector(selectScenes);
  const dispatch = useDispatch();

  function generateFile(){
    //this is not what I shoud do, but it works!
    const newState = JSON.stringify(scenes)
    const newStateModified = JSON.parse(newState)
    newStateModified.scenes[props.selectedScene].background = props.canvasRef.getContent()

    const blob = new Blob([JSON.stringify(newStateModified)], {type : 'application/json'});
    const timeStamp = new Date().toLocaleDateString();

    const elem = document.createElement('a');
    elem.href = URL.createObjectURL(blob);
    elem.download = `export_${timeStamp}`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }

  async function loadFile(){
    //get file
    const inputLink = document.createElement('input');
    inputLink.type = "file"
    inputLink.onchange = () => fileUploadedEvent(inputLink);
    document.body.appendChild(inputLink);
    inputLink.click();
    document.body.removeChild(inputLink);
  }

  function fileUploadedEvent(inputLink){
    console.log('hello')
    const reader = new FileReader();
    reader.onload = handleFileRead;
    reader.readAsText(inputLink.files[0]);
  }

  function handleFileRead(e){
    const newContent = JSON.parse(e.target.result)
    dispatch(setContent(newContent))
    //select first scene
    //set correct scene content
    props.reloadState(newContent.scenes[1].background, newContent.scenes[1].links);
  }

  return (
    <ToolWrapper>
      <Tools>
        <PencilSimple 
          size={32} 
          weight="fill" 
          color={props.selectedTool == "draw" ? themeContext.selectedAccentItem : themeContext.accentItem } 
          onClick={() => props.setSelectedTool("draw")}
          />
        
        <Eraser 
          size={32} 
          weight="fill" 
          color={props.selectedTool == "erase" ? themeContext.selectedAccentItem : themeContext.accentItem } 
          onClick={() => props.setSelectedTool("erase")}
          />
        
        <Link 
          size={32} 
          weight="fill" 
          color={props.selectedTool == "link" ? themeContext.selectedAccentItem : themeContext.accentItem } 
          onClick={() => props.setSelectedTool("link")}
          />
      </Tools>

      <Tools>
        <FolderOpen
          size={32} 
          weight="fill" 
          color={themeContext.accentItem}
          onClick={loadFile}
          />
        <FloppyDisk
          size={32} 
          weight="fill" 
          color={themeContext.accentItem}
          onClick={generateFile}
          />

      </Tools>
    </ToolWrapper>
  );
}