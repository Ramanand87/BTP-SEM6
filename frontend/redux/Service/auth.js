"use client";

import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "User",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),

  tagTypes: ["User"],

  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (data) => ({
        url: `/customer/login`,
        method: "POST",
        body: data,
      }),
    }),

    // Register mutation
    register: builder.mutation({
      query: (data) => ({
        url: `/customer/register`,
        method: "POST",
        body: data,
      }),
    }),

    // Fetch a single chef by ID
    getChef: builder.query({
      query: (id) => `/homemaker/${id}`,
    }),

    // Fetch all users
    getUsers: builder.query({
      query: () => ({
        url: "/getAllUsers",
      }),
      providesTags: [{ type: "User", id: "LIST" }],
      keepUnusedDataFor: 5,
    }),

    // Delete a user
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // Update a user
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
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
  useGetChefQuery,
} = authApi;
