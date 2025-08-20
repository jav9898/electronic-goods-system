import { configureStore } from '@reduxjs/toolkit';
import entitiesReducer from '../features/entities/entitiesSlice';
import userReducer from '../features/user/userSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';

export const store = configureStore({
  reducer: {
    entities: entitiesReducer,
    user: userReducer,
    analytics: analyticsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
