import { configureStore } from '@reduxjs/toolkit'
import sceneReducer from '../features/sceneSlice'

export default configureStore({
  reducer: {
    scenes: sceneReducer
  }
})