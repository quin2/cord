import * as React from 'react';
import styled from 'styled-components'
import { Play, PlusCircle, Pause } from "phosphor-react";

import { useSelector, useDispatch, } from 'react-redux'
import {
  addScene,
  selectScenes,
  sceneCount
} from '../features/sceneSlice'

const Scenes = styled.div`
  width: 150px;
  height: ${props => props.viewMode ? "fit-content" : "95vh"};
  background-color: ${props => props.theme.surface};
  margin: 1em;
  border-radius: ${props => props.theme.radius};
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`

const PlayButton = styled.button`
   width: 100px;
    height: 40px;
   background-color: ${props => props.theme.playButton};
   border: none;
   border-radius: 1em;
    margin-top: 1em;
  margin-bottom: 1em;
  cursor: pointer;


   display: flex;
   align-items: center;
   justify-content: center;
`

const SceneCard = styled.div`
  height: auto;
  background-color: ${props => props.selected ? props.theme.selectedAccentItem : props.theme.accentItem};
  display: flex;
  align-items: left;
background-clip: padding-box;
flex-direction: column;
font-size: 24px;
  width: 100%;
  cursor: pointer;
`

const SceneCardChild = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5em;
  text-align: left;
`

const ImageCard = styled.div`
  background-color: white;
  background-image: url(${props => props.img});
  background-size: contain;
  height: 80px;
  width: 100%;
  border-radius: ${props => props.theme.radius};
  background-repeat: no-repeat;
`

const ImageCaption = styled.div`
  width: 100%;
  margin-top: 0.5em;
  font-size: 0.8em;
`

const SceneList = styled.div`
  overflow: auto;
  height: 83vh;
  width: 100%;
  border-radius: 1px 0 0 1px;
`

const AddSceneButton = styled(SceneCard)`
  border-radius: 0 0 ${props => props.theme.radius}  ${props => props.theme.radius};
  &:hover{
    background-color: ${props => props.theme.selectedAccentItem};
  }
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
    <Scenes viewMode={props.viewMode}>
      <PlayButton onClick={props.switchViewMode}>
        {props.viewMode ? <Pause size={24} weight="fill" /> : <Play size={24} weight="fill"/>}
      </PlayButton>
      
      {props.viewMode ?
        null
        :
        <>
          <SceneList>
            {
              Object.keys(scenes.scenes).map((keyName, index) => {
                return (
                  <SceneCard selected={props.selectedScene == keyName} onClick={() => props.switchCanvas(keyName)} key={keyName}>
                    <SceneCardChild>
                      <ImageCard img={scenes.scenes[keyName].background}/>
                      <ImageCaption>
                        {scenes.scenes[keyName].name}
                      </ImageCaption>
                    </SceneCardChild>
                  </SceneCard>
                );
              })
            }
          </SceneList>

          <AddSceneButton>
            <SceneCardChild onClick={() => addSceneHandler()}>
              <PlusCircle size={32} weight="fill" />
            </SceneCardChild>
          </AddSceneButton>
        </>
      }
      
  </Scenes>
  );
}