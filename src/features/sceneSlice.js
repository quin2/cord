import { createSlice } from '@reduxjs/toolkit'

export const sceneSlice = createSlice({
  name: 'scene',
  initialState: {
      scenes: {
        1: {
          name: "Scene 1",
          background: "",
          links: []
        }
      }    
  },
  reducers:{
    addScene(state){
      const newKey = Object.keys(state.scenes).length + 1

      return {...state, scenes: {...state.scenes, [newKey]:{
        name: `Scene ${newKey}`,
        background: "",
        links: []
      }}};
    },
    setSceneBackground(state, action){
      const id = action.payload.id;
      const bg = action.payload.background;
      return {...state, scenes: {...state.scenes, [id]:{
        ...state.scenes[id],
        background: bg
      }}}
    },
    setSceneName(state, action){
      const localState = state
      localState.scenes[action.payload.id].name = action.payload.name;

      return localState;
    },
    addLink(state, action){
      const localState = state;
      localState.scenes[action.payload.id].links.push({
        to: action.payload.to,
        rect: action.payload.rect
      })

      return localState;
    },
    removeLink(state, action){
      //your guess is as good as mine!
      const localState = state
      localState.scenes[action.payload.id].links.splice(action.payload.linkId, 1);

      return localState;
    },
    editLink(){
      //your guess is as good as mine!
    },
    setContent(state, action){
      return {...state, ...action.payload}
    }
  },
})

export const {addScene, setSceneBackground, setSceneName, addLink, removeLink, setContent} = sceneSlice.actions;
export default sceneSlice.reducer;
export const selectScenes = (state) => state.scenes;
export const sceneCount = (state) => Object.keys(state.scenes.scenes).length;