import React, { useState, useEffect } from 'react'
import styled, {ThemeProvider} from 'styled-components'

import Sidebar from './components/Sidebar';
import Palette from './components/Palette';
import Editor from './components/Editor';
import LinkMenu from './components/LinkMenu';
import EditorParent from './components/EditorParent';
import Viewer from './components/Viewer';

import { useDispatch, useSelector } from 'react-redux'
import {
  setSceneBackground,
  selectScenes,
  addScene
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
  background: "#1D1A31",
  surface: "#4D2D52" ,
  accent: "#9A4C95",

  selectedAccentItem: "#89AAE6",

  radius: "10px",
  playButton: "#5EF38C"
};


export default function App() {
  const dispatch = useDispatch();
  const scenes = useSelector(selectScenes);

  const [selectedTool, setSelectedTool] = React.useState<string>("draw");
  const [selectedScene, setSelectedScene] = React.useState(1);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [canvasRef, setCanvasRef] = useState();

  const [viewMode, setViewMode] = useState(false);

  function switchCanvas(targetScene){
    setOpenMenu(false);
    setSelectedTool('draw');

    const dataString = canvasRef.getContent();
    dispatch(setSceneBackground({id: selectedScene, background: dataString}))
    canvasRef.handleClear();

    const newDataString = scenes.scenes[targetScene];
    if(newDataString){
      canvasRef.putContent(newDataString.background, scenes.scenes[targetScene].links);
    }

    setSelectedScene(targetScene);
  }

  function cacheState(){
    const dataString = canvasRef.getContent();
    const background = {id: selectedScene, background: dataString}
    dispatch(setSceneBackground(background))
  }

  //before we switch to view mode, cache canvas content
  function switchViewMode(){
    if(!viewMode){
      //cache last page we were working on
      cacheState()
      setOpenMenu(false);
    }

    setViewMode(!viewMode)
  }

  function reloadState(content, links){
    setSelectedScene(1);
    canvasRef.putContent(content, links);
  }

  return (
    <ThemeProvider theme={theme}>
      <Contain>
        <EditorArea>
          <Sidebar selectedScene={selectedScene} switchCanvas={switchCanvas} viewMode={viewMode} switchViewMode={switchViewMode}/>
          {viewMode ?
            <Viewer/>
            :
            <>
            <Palette 
              selectedTool={selectedTool} 
              setSelectedTool={setSelectedTool} 
              reloadState={reloadState}
              selectedScene={selectedScene}
              canvasRef={canvasRef}
              />
            <EditorParent 
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              switchCanvas={switchCanvas} 
              selectedScene={selectedScene} 
              selectedTool={selectedTool} 
              setSelectedScene={setSelectedScene} 
              setSelectedTool={setSelectedTool}
              canvasRef={canvasRef}
              setCanvasRef={setCanvasRef}
              />
              </>
            }
          
        </EditorArea>
      </Contain>
    </ThemeProvider>
  )
}