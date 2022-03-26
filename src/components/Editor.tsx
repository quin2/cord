import React, { useState, useEffect } from 'react';
import MyCanvas from '../assets/scripts/EditorArea.js';
import styled from 'styled-components';




const FlexArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EditorCanvas = styled.canvas`
  width: 800px;
  height: 600px;
`

const Editor = React.memo(props => {
  const canv = React.useRef();
  
  useEffect(() => {
    props.setCanvasRef(new MyCanvas(canv.current, props.setMenu));
  },[]);

  
  useEffect(() => {
    if(props.canvasRef){
      props.canvasRef.switchTool(props.selectedTool);
    }
    
  },[props.selectedTool]);

  
  return (
    <FlexArea>
      <EditorCanvas ref={canv} id="c" width={800} height={600}>
      </EditorCanvas>
    </FlexArea>
  );
});

export default Editor;