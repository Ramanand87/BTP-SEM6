"use client";

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { cartApi } from './Service/cart';
import { reviewApi } from './Service/review';
import { authApi } from './Service/auth';
import authReducer from './features/authFeature';
import { profileApi } from './Service/profile';
import { dishApi } from './Service/dish';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [dishApi.reducerPath]: dishApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      dishApi.middleware,
      cartApi.middleware,
      reviewApi.middleware,
      profileApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);