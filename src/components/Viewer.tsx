import React, { useState } from 'react'
import styled from 'styled-components'

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

const PlayerCanvas = styled.div`
  width: 800px;
  height: 600px;
  background-color: white;
  background-image: url(${props => props.img});
  position: relative;
`

const PlayerControlBound = styled.div`
	position: absolute;
	cursor: pointer;
	top: ${props => props.bound[1]}px;
	left: ${props => props.bound[0]}px;
	width: ${props => props.bound[2]}px;
	height: ${props => props.bound[3]}px;
`

export default function Viewer(props){
	const [playerScreen, setPlayerScreen] = useState(1);
	const scenes = useSelector(selectScenes);

	const controlBounds = scenes.scenes[playerScreen].links.map((link) => {
		return <PlayerControlBound bound={link.rect} key={link.rect[0]} onClick={() => setPlayerScreen(link.to)}/>
	})

	return (
		<FlexArea>
			<PlayerCanvas img={scenes.scenes[playerScreen].background}>
				{ controlBounds }
			</PlayerCanvas>
		</FlexArea>
	);
}