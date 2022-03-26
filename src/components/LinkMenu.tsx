import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LinkMenuContain = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  background-color: red;
  color: white;
`;

const LinkMenuItem = styled.div`
  width: 100%;
`;

export default function LinkMenu(props){
  return (
    <>
      {
        props.show &&
        <LinkMenuContain left={props.left} top={props.top}>
          <LinkMenuItem>Create new scene</LinkMenuItem>
          <LinkMenuItem>Link to existing scene</LinkMenuItem>
          <LinkMenuItem>Remove link</LinkMenuItem>
        </LinkMenuContain>
      }
    </>
  )
}

