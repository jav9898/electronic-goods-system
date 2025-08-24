
import { configureStore } from '@reduxjs/toolkit';
import entityReducer from './slices/entitySlice';


export const store = configureStore({
  reducer: {
    entities: entityReducer,

  },
});


