import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/user/profile',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.access; 
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (username) => `/${username}`,  // Fetch user profile by username
    }),
    updateProfile: builder.mutation({
      query: ({ username, updatedData }) => ({
        url: `/${username}`, // Update user profile by username
        method: 'PUT',
        body: updatedData,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
