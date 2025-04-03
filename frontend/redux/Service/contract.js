import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const contractApi = createApi({
  reducerPath: 'contractApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/contracts/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.access; 
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getContracts: builder.query({
      query: (id) => `/${id}`,
    }),
    createContract: builder.mutation({
        query: (newContract) => ({
          url: "/",
          method: "POST",
          body: newContract,
        }),
      }),
    
  }),
});

export const { useGetContractsQuery, useCreateContractMutation } = contractApi;
