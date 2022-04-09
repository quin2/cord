import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Editor from './Editor';
import LinkMenu from './LinkMenu';

import { useDispatch, useSelector } from 'react-redux'
import {
  setSceneBackground,
  selectScenes,
  addScene,
  addLink,
  sceneCount
} from '../features/sceneSlice'

export interface IEditorParentProps {
    selectedTool: string,
    setSelectedTool: Function,
    setOpenMenu: Function,
    canvasRef: any,
    switchCanvas: Function,
    selectedScene: number,
    openMenu: boolean,
    setSelectedScene: Function,
    setCanvasRef: Function
}

export default function EditorParent(props: IEditorParentProps) {
  const dispatch = useDispatch();
  const scenes = useSelector(selectScenes);
  const count = useSelector(sceneCount);

  const [menuLeft, setMenuLeft] = React.useState(0);
  const [menuTop, setMenuTop] = React.useState(0);
  const [menuContext, setMenuContext] = React.useState<number | null>(null);

  function setLocation(x: number, y: number, context: number){
    setMenuLeft(x);
    setMenuTop(y);
    setMenuContext(context);
    props.setOpenMenu(true);
  }

  function hideMenu(){
    props.setOpenMenu(false);
  }

  function createSceneDriver(copyLastScene: boolean){
    //close popup
    props.setOpenMenu(false);

    //get coords of what we last clicked on in canvas world
    const lastClickedBound = props.canvasRef.getLastClickedBound() //formatted as x, y, w, h

            //add scene
    dispatch(addScene())
    const nextScene = count + 1

    //add linkage to current scene
    dispatch(addLink({id: props.selectedScene, to: nextScene, rect: lastClickedBound}))

    //copy last scene if we want to 
    let currentContent
    if(copyLastScene){
      currentContent = props.canvasRef.getContent()
      dispatch(setSceneBackground({id: nextScene, background: currentContent}))
    }

    //switch to new canvas
    props.switchCanvas(nextScene);

    //copy content to next scene as well
    if(copyLastScene){
      props.canvasRef.putContent(currentContent, []);
    }

    //switch tool back to drawing
    props.setSelectedTool('draw');
  }

  //not dry but I can live with it
  function addSceneLink(destId: number){
    props.setOpenMenu(false);
    const lastClickedBound = props.canvasRef.getLastClickedBound() //formatted as x, y, w, h
    const sceneLink = {id: props.selectedScene, to: destId, rect: lastClickedBound}

    dispatch(addLink(sceneLink))

    const sceneBG = {id: props.selectedScene, background: props.canvasRef.getContent()}
    dispatch(setSceneBackground(sceneBG))

    props.canvasRef.putLink(sceneLink)
  }

  function removeLink(){
    props.canvasRef.removeLink(props.selectedScene);
  } 

  
  return (
    <>
      <LinkMenu 
        show={props.openMenu} 
        setOpenMenu={props.setOpenMenu}
        top={menuTop} 
        left={menuLeft} 
        createScene={createSceneDriver} 
        menuContext={menuContext} 
        selectedScene={props.selectedScene}
        removeLink={removeLink}
        addSceneLink={addSceneLink}
        />
      <Editor 
        selectedTool={props.selectedTool} 
        setSelectedTool={props.setSelectedTool}
        setMenu={setLocation} 
        hideMenu={hideMenu}
        canvasRef={props.canvasRef}
        setCanvasRef={props.setCanvasRef}
        selectedScene={props.selectedScene}
        />
    </>
  )
}