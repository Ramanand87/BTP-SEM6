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
    Adminlogin: builder.mutation({
      query: (data) => ({
        url: `/login/admin/`,
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
        url: '/allusers/',
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

    verifyUser: builder.mutation({
      query: ({id,data}) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useAdminloginMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useVerifyUserMutation,
} = authApi;
