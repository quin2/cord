import React, { useState, useEffect } from 'react';
import MyCanvas from '../assets/scripts/EditorArea.js';
import styled from 'styled-components';

import { useSelector } from 'react-redux'
import {
  selectScenes
} from '../features/sceneSlice'



const FlexArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EditorCanvas = styled.canvas`
  width: 800px;
  height: 600px;
  background-color: white;
`

export interface IEditorProps {
  setSelectedTool: Function,
  canvasRef: any,
  hideMenu: Function,
  setCanvasRef: Function,
  selectedTool: string,
  selectedScene: number,
  setMenu: Function
}

const Editor = React.memo((props: IEditorProps) => {
  const canv = React.useRef<HTMLCanvasElement>(null);
  const scenes = useSelector(selectScenes);

  
  useEffect(() => {
    props.setSelectedTool('draw')

    let ref = new MyCanvas(canv.current, props.setMenu, props.hideMenu)
    props.setCanvasRef(ref);

    const newDataString = scenes.scenes[props.selectedScene];
    if(newDataString){
      ref.putContent(newDataString.background, newDataString.links);
    }
  },[]);
  
  useEffect(() => {
    if(props.canvasRef){
      props.canvasRef.switchTool(props.selectedTool);
    }
    
  },[props.selectedTool]);
  
  return (
    <FlexArea>
      <EditorCanvas ref={canv} id="c" width={800} height={600}></EditorCanvas>
    </FlexArea>
  );
});

export default Editor;