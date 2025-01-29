import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store'; // Update with the correct path to your store
export interface Dish {
    name: string;
    description: string;
    ingredients: string[];
    timeToDeliver: string;
    veg: boolean;
    price: string;
    foodImages: FoodImage[];
  }
  
  interface FoodImage {
    fileName: string;
    fileType: string;
    fileContent: string; // Assuming base64 encoded image data is a string
  }
  
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/foodItems',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userInfo?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const dishApi = createApi({
  reducerPath: 'dishApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Dish'],
  endpoints: (builder) => ({
    // get all dishes
    getAllDishes: builder.query<Dish[], void>({
      query: () => `/all`,
      providesTags: [{ type: 'Dish', id: 'LIST' }],
    }),
    getSingleDish: builder.query<Dish, string>({
      query: (foodItemId) => `/${foodItemId}`,
    }),
    // add dish
    addDish: builder.mutation<void, Partial<Dish>>({
      query: (newDish) => ({
        url: `/`,
        method: 'POST',
        body: newDish,
      }),
      invalidatesTags: [{ type: 'Dish', id: 'LIST' }],
    }),

    deleteDish: builder.mutation<void, string>({
      query: (id) => ({
        url: `/alldishes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Dish', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllDishesQuery,
  useGetSingleDishQuery,
  useAddDishMutation,
  useDeleteDishMutation,
} = dishApi;
