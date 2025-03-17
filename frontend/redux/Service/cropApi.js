import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cropApi = createApi({
  reducerPath: "cropApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/crops/detail/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.access;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Crop"],
  endpoints: (builder) => ({
    getCrops: builder.query({
      query: () => "/curr/",
      providesTags: ["Crop"],
    }),
    getAllCrops: builder.query({
      query: () => "/",
      providesTags: ["Crop"],
    }),
    addCrop: builder.mutation({
      query: (newCrop) => ({
        url: "/",
        method: "POST",
        body: newCrop,
      }),
      invalidatesTags: ["Crop"],
    }),
    updateCrop: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body: body,
        // Do not set Content-Type header manually
      }),
      invalidatesTags: ["Crop"],
    }),
    deleteCrop: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Crop"],
    }),
  }),
});

export const {
  useGetCropsQuery,
  useAddCropMutation,
  useUpdateCropMutation,
  useDeleteCropMutation,
  useGetAllCropsQuery,
} = cropApi;
