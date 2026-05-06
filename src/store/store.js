import { configureStore } from '@reduxjs/toolkit';
import crmReducer from './crmSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    crm: crmReducer,
    ui: uiReducer,
  },
});