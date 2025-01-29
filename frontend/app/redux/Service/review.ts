import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

interface Review {
  id: number;
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
  rating: number;
  date: string;
  comment: string;
  likes: number;
  images?: string[];
}

interface AddReviewData {
  foodItemId: string;
  rating: number;
  comment: string;
  foodImage?: string;
}

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: 'http://localhost:5000',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userInfo?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], string>({
      query: (foodItemId) => `/review/${foodItemId}`,
      providesTags: (result) =>
        Array.isArray(result)
          ? result.map(({ id }) => ({ type: 'Review', id }))
          : [], // Return an empty array or handle cases where result is not an array
    }),
    
    addReview: builder.mutation<void, AddReviewData>({
      query: ({ foodItemId, ...data }) => ({
        url: `/review/${foodItemId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),
    deleteReview: builder.mutation<void, string>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),
  }),
});

export const { useGetReviewsQuery, useAddReviewMutation, useDeleteReviewMutation } = reviewApi;
