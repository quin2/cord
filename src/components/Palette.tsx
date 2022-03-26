import React from 'react';
import { Link, PencilSimple, Eraser } from "phosphor-react";
import styled from 'styled-components';

const Tools = styled.div`
  width: 40px;
  height: 120px;
  margin: 1em 0 1em 0;
  border-radius: ${props => props.theme.radius};
  background-color: ${props => props.theme.surface};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
   > * {
      margin-top: 5px;
   }
`

export default function Palette(props){  
  return (
    <Tools>
      <PencilSimple 
        size={32} 
        weight="fill" 
        color={props.selectedTool == "draw" ? "#FF0000" : "#FFFFFF"} 
        onClick={() => props.setSelectedTool("draw")}
        />
      
      <Eraser 
        size={32} 
        weight="fill" 
        color={props.selectedTool == "erase" ? "#FF0000" : "#FFFFFF"} 
        onClick={() => props.setSelectedTool("erase")}
        />
      
      <Link 
        size={32} 
        weight="fill" 
        color={props.selectedTool == "link" ? "#FF0000" : "#FFFFFF"} 
        onClick={() => props.setSelectedTool("link")}
        />
    </Tools>
  );
}