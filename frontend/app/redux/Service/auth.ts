"use client"

import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  userId: string;
  name?: string;
  email?: string;
}

export const authApi = createApi({
  reducerPath: 'User',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),

  tagTypes: ['User'], 

  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation<User, LoginData>({
      query: (data) => ({
        url: `/customer/login`,
        method: 'POST',
        body: data,
      }),
    }),

    // Register mutation
    register: builder.mutation<User, RegisterData>({
      query: (data) => ({
        url: `/customer/register`,
        method: 'POST',
        body: data,
      }),
    }),
    getChef: builder.query<User, string>({
      query: (id) => `/homemaker/${id}`,
    }),

    // Fetch all users query
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: '/getAllUsers',
      }),
      providesTags: [{ type: 'User', id: 'LIST' }], // Provide tags with 'id'
      keepUnusedDataFor: 5,
    }),

    // Delete a user mutation
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }], // Invalidate the 'User' list
    }),

    // Update user mutation
    updateUser: builder.mutation<void, UpdateUserData>({
      query: (data) => ({
        url: `/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }], // Invalidate the 'User' list to refetch users
    }),
  }),
});

// Export hooks for each API call
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetChefQuery
} = authApi;
