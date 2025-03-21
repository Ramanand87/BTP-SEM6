"use client";

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authApi } from './Service/auth';
import authReducer from './features/authFeature';
import { cropApi } from './Service/cropApi';
import { profileApi } from './Service/profileApi';
import { marketApi } from './Service/marketApi';
import { demandApi } from './Service/demandApi';
import { ratingApi } from './Service/ratingApi';
import { chatApi } from './Service/chatApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,

    [authApi.reducerPath]: authApi.reducer,
    [cropApi.reducerPath]:cropApi.reducer,
    [profileApi.reducerPath]:profileApi.reducer,
    [marketApi.reducerPath]:marketApi.reducer,
    [demandApi.reducerPath]:demandApi.reducer,
    [ratingApi.reducerPath]:ratingApi.reducer,
    [chatApi.reducerPath]:chatApi.reducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      cropApi.middleware,
      profileApi.middleware,
      marketApi.middleware,
      demandApi.middleware,
      ratingApi.middleware,
      chatApi.middleware,
      
    ),
});

setupListeners(store.dispatch);
