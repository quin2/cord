import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux'
import {
  selectScenes,
  removeLink
} from '../features/sceneSlice'

const LinkMenuContain = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  background-color: ${props => props.theme.surface};
  color: white;
  cursor: pointer;
  padding: 0.5em;
  border-radius: 0.5em;
`;

const LinkMenuItem = styled.div`
  width: auto;
  border-radius: 0.25em;
  padding: 0.12em;

  &:hover{
    background-color: ${props => props.theme.selectedAccentItem};
  }
`;

export default function LinkMenu(props){
  const scenes = useSelector(selectScenes);

  const [sceneListMode, setSceneListMode] = useState(false);

  useEffect(() => {
    if(props.show){
      setSceneListMode(false);
    }
    
  },[props.show]);


  return (
    <>
      {
        props.show &&
        <LinkMenuContain left={props.left} top={props.top}>
          {sceneListMode ? <SceneList {...props} />  : <ContextMenu {...props} openSceneList={() => setSceneListMode(true)}/>}
        </LinkMenuContain>
      }
    </>
  )
}

function SceneList(props){
  const scenes = useSelector(selectScenes);

  function addSceneLinkHandler(key){
    props.addSceneLink(key)
  }

  const sceneList = Object.keys(scenes.scenes).map((key, idx) => {
        return <LinkMenuItem key={idx} onClick={() => addSceneLinkHandler(key)}>{scenes.scenes[key].name}</LinkMenuItem>
  });

  return (
    <>
      {sceneList}
    </>
  );
}

function ContextMenu(props){
  const scenes = useSelector(selectScenes);
  const dispatch = useDispatch();

  function removeLinkHandler(){
    props.setOpenMenu(false);
    dispatch(removeLink({id: props.selectedScene, linkId: props.menuContext}))
    //finally, rerender surface
    props.removeLink();
  }

  return (
    <>
      {(props.menuContext || props.menuContext === 0) ? 
            <LinkMenuItem>
              Linked to {scenes.scenes[scenes.scenes[props.selectedScene].links[props.menuContext].to].name}
            </LinkMenuItem> 
          : null}
          {(!props.menuContext && props.menuContext !== 0) ? <LinkMenuItem onClick={() => props.createScene()}>Create new scene</LinkMenuItem> : null}
          {(!props.menuContext && props.menuContext !== 0) ? <LinkMenuItem onClick={() => props.createScene(true)}>Clone and create new scene</LinkMenuItem> : null}
          {(!props.menuContext && props.menuContext !== 0) ? <LinkMenuItem onClick={props.openSceneList}>Link to existing scene</LinkMenuItem> : null}
          {(props.menuContext || props.menuContext === 0) ? <LinkMenuItem onClick={removeLinkHandler}>Remove link</LinkMenuItem> : null}
      </>
  );
}

