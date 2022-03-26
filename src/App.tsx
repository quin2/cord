import React, { useState, useEffect } from 'react'
import styled, {ThemeProvider} from 'styled-components'

import Sidebar from './components/Sidebar';
import Palette from './components/Palette';
import Editor from './components/Editor';
import LinkMenu from './components/LinkMenu';

import { useDispatch, useSelector } from 'react-redux'
import {
  setSceneBackground,
  selectScenes
} from './features/sceneSlice'

const Contain = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
background-color: ${props => props.theme.background};
`

const EditorArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
`

const theme = {
  background: "#f2f9f1",
  surface: "lightblue",
  accent: "darkblue",
  radius: "10px"
};

export default function App() {
  const dispatch = useDispatch();
  const scenes = useSelector(selectScenes);

  const [selectedTool, setSelectedTool] = React.useState<string>("draw");
  const [openMenu, setOpenMenu] = React.useState(false);
  const [menuLeft, setMenuLeft] = React.useState(0);
  const [menuTop, setMenuTop] = React.useState(0);
  const [selectedScene, setSelectedScene] = React.useState(1);
  const [canvasRef, setCanvasRef] = useState();

  function setLocation(x, y){
    setMenuLeft(x);
    setMenuTop(y);
    setOpenMenu(true);
  }

  function switchCanvas(targetScene){
    const dataString = canvasRef.getContent();
    dispatch(setSceneBackground({id: this.selectedScene, background: dataString}))
    canvasRef.handleClear();

    setSelectedScene(targetScene);

    const newDataString = scenes.scenes[targetScene];
    canvasRef.putContent(newDataString.background);
  }
  
  return (
    <ThemeProvider theme={theme}>
      <Contain>
        <EditorArea>
          <LinkMenu show={openMenu} top={menuTop} left={menuLeft}/>
          <Sidebar selectedScene={selectedScene} switchCanvas={switchCanvas}/>
          <Palette selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
          <Editor 
            selectedTool={selectedTool} 
            setMenu={setLocation} 
            selectedScene={selectedScene} 
            setSelectedScene={setSelectedScene}
            canvasRef={canvasRef}
            setCanvasRef={setCanvasRef}
            />
        </EditorArea>
      </Contain>
    </ThemeProvider>
  )
}