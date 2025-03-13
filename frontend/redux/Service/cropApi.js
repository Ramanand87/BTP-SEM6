// src/services/cropApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cropApi = createApi({
  reducerPath: 'cropApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://your-api-endpoint.com/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Assuming you have an auth slice
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Crop'],
  endpoints: (builder) => ({
    getCrops: builder.query({
      query: () => '/crops',
      providesTags: ['Crop'],
    }),
    addCrop: builder.mutation({
      query: (newCrop) => ({
        url: '/crops',
        method: 'POST',
        body: newCrop,
      }),
      invalidatesTags: ['Crop'],
    }),
    updateCrop: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/crops/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Crop'],
    }),
    deleteCrop: builder.mutation({
      query: (id) => ({
        url: `/crops/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Crop'],
    }),
  }),
});

export const { useGetCropsQuery, useAddCropMutation, useUpdateCropMutation, useDeleteCropMutation } = cropApi;