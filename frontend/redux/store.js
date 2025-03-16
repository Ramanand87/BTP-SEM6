"use client";

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authApi } from './Service/auth';
import authReducer from './features/authFeature';
import { cropApi } from './Service/cropApi';
import { profileApi } from './Service/profileApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,

    [authApi.reducerPath]: authApi.reducer,
    [cropApi.reducerPath]:cropApi.reducer,
    [profileApi.reducerPath]:profileApi.reducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      cropApi.middleware,
      profileApi.middleware,
      
    ),
});

setupListeners(store.dispatch);
