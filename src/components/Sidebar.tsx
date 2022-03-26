import * as React from 'react';
import styled from 'styled-components'
import { Play, PlusCircle } from "phosphor-react";

import { useSelector, useDispatch, useSelector } from 'react-redux'
import {
  addScene,
  selectScenes,
  sceneCount
} from '../features/sceneSlice'

const Scenes = styled.div`
  width: 20%;
  max-width: 300px;
  height: auto;
  background-color: ${props => props.theme.surface};
  margin: 1em;
  border-radius: ${props => props.theme.radius};
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PlayButton = styled.button`
   width: 100px;
    height: 40px;
   background-color: #388e3c;
   border: none;
   border-radius: 1em;
    margin-top: 1em;
  margin-bottom: 1em;


   display: flex;
   align-items: center;
   justify-content: center;
`

const SceneCard = styled.div`
  height: auto;
  background-color: ${props => props.selected ? "orange" : "lightgray"};
  display: flex;
  align-items: left;
background-clip: padding-box;
flex-direction: column;
font-size: 24px;
  width: 100%;
`

const SceneCardChild = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5em;
  text-align: left;
`

const ImageCard = styled.div`
  height: 100px;
  width: 100%;
  background-color: white; 
  border-radius: ${props => props.theme.radius};
`

const ImageCaption = styled.div`
  width: 100%;
  margin-top: 0.5em;
  font-size: 0.8em;
  
`

export default function Sidebar(props){
  const scenes = useSelector(selectScenes);
  const dispatch = useDispatch();
  const count = useSelector(sceneCount);

  function addSceneHandler(){
    dispatch(addScene())
    props.switchCanvas(count + 1);
  }
  
  return (
    <Scenes>
      <PlayButton>
        <Play size={24} weight="fill"/>
      </PlayButton>
      {
        Object.keys(scenes.scenes).map((keyName, index) => {
          return (
            <SceneCard selected={props.selectedScene == keyName} onClick={() => props.switchCanvas(keyName)}>
              <SceneCardChild>
                <ImageCard/>
                <ImageCaption>
                  {scenes.scenes[keyName].name}
                </ImageCaption>
              </SceneCardChild>
            </SceneCard>
          );
        })
      }
      <SceneCard>
        <SceneCardChild onClick={() => addSceneHandler()}>
          <PlusCircle size={32} weight="fill" />
        </SceneCardChild>
      </SceneCard>
  </Scenes>
  );
}