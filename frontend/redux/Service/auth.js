"use client";

import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'User',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/user' }),

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `/login/`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `/signup/`,
        method: 'POST',
        body: data,
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: '/getAllUsers',
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/${userId}`,
        method: 'DELETE',
      }),
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = authApi;