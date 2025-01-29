import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Define types for cart items and cart
export interface CartItem {
  foodItem: string;
  homemaker: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/cart',  // Adjust URL if needed
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userInfo?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    // Get cart contents
    getCart: builder.query<Cart, void>({
      query: () => '/',  // Base route to fetch cart data
      providesTags: ['Cart'],
    }),

    // Add item to cart
    addToCart: builder.mutation<{ message: string; cart: Cart }, Partial<CartItem>>({
      query: (item) => ({
        url: '/add',  // Route to add item
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),

    // Update item quantity in cart
    updateCartItem: builder.mutation<{ message: string; cart: Cart }, { foodItemId: string; quantity: number }>({
      query: ({ foodItemId, quantity }) => ({
        url: `/${foodItemId}`,  // Route to update item
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    // Remove item from cart
    removeFromCart: builder.mutation<{ message: string; cart: Cart }, string>({
      query: (foodItemId) => ({
        url: `/${foodItemId}`,  // Route to remove item
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi;
