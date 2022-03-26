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
      state.scenes = {...state.scenes, [newKey]:{
        name: `Scene ${newKey}`,
        background: "",
        links: []
      }
    }
    },
    setSceneBackground(state, action){
      state.scenes[action.payload.id].background = action.payload.background;
    },
    setSceneName(state, action){
      state.scenes[action.payload.id].name = action.payload.name
    },
    addLink(state, action){
      state.scenes[action.payload.id].links.push({
        to: action.payload.to,
        anchorX: action.payload.anchorX,
        anchorY: action.payload.anchorY
      })
    },
    removeLink(){
      //your guess is as good as mine!
    },
    editLink(){
      //your guess is as good as mine!
    }
  },
})

export const {addScene, setSceneBackground, setSceneName, addLink} = sceneSlice.actions;
export default sceneSlice.reducer;
export const selectScenes = (state) => state.scenes;
export const sceneCount = (state) => Object.keys(state.scenes.scenes).length;