import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contractApi = createApi({
  reducerPath: "contractApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/contracts/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.access;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Contracts"], // Define tag types
  endpoints: (builder) => ({
    getContract: builder.query({
      query: (id) => `/${id}/`,
      providesTags: (result, error, id) => [{ type: "Contracts", id }],
    }),
    getAllPayments: builder.query({
      query: (id) => `/transaction/${id}/`,
      providesTags: (result, error, id) => [{ type: "Contracts", id }],
    }),
    getAllContracts: builder.query({
      query: () => "/",
      providesTags: ["Contracts"], // Automatically refetches when invalidated
    }),
    createContract: builder.mutation({
      query: (newContract) => ({
        url: "/",
        method: "POST",
        body: newContract,
      }),
      invalidatesTags: ["Contracts"], // Invalidates cache to trigger refetch
    }),
    createPayment: builder.mutation({
      query: (newPayment) => ({
        url: "/transaction/",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: ["Contracts"], // Invalidates cache to trigger refetch
    }),
    // In your contractApi definition
    updateContract: builder.mutation({
      query: ({ contract_id, updatedData }) => ({
        url: `/${contract_id}/`, // Adjust this to match your API endpoint
        method: "PUT", // or "PATCH" depending on your API
        body: updatedData, // Send the data directly as the body
      }),
      invalidatesTags: ["Contract"], // Ensure this matches your tag setup
    }),
    deleteContract: builder.mutation({
      query: (id) => ({
        url: `/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contracts"], // Refetch contracts after deletion
    }),
  }),
});

export const {
  useGetContractQuery,
  useGetAllContractsQuery,
  useGetAllPaymentsQuery,
  useCreateContractMutation,
  useCreatePaymentMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
} = contractApi;
