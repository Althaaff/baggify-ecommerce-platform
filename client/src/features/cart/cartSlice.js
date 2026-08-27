import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cartApiService } from "../../services/cartServices.js";
import { toast } from "react-hot-toast";

// fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApiService.getCart();

      if (!response?.data?.cart) {
        return null;
      }
      // return the cart object from nested response
      return response.data?.cart;
    } catch (error) {
      console.error("fetchCart Error:", error);
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  },
);

// add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApiService.addToCart({ productId, quantity });
      toast.success(response.data?.message || "Added to cart!");

      return {
        cart: response.data?.cart,
        addedItem: response.data?.addedItem,
      };
    } catch (error) {
      console.error("addToCart Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add to cart",
      );
      return rejectWithValue(error.message);
    }
  },
);

// remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartApiService.removeFromCart(itemId);
      toast.success(response.data.message || "Item removed from cart");
      const cartData = response?.data?.cart;

      if (!cartData) {
        return {
          items: [],
          totalItems: 0,
          uniqueItems: 0,
          subtotal: 0,
          total: 0,
          totalSavings: 0,
          currency: "INR",
          isEmpty: true,
          couponCode: null,
          couponDiscountAmount: 0,
        };
      }

      return cartData;
    } catch (error) {
      console.error("removeFromCart Error", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove from cart",
      );
      return rejectWithValue(error.message);
    }
  },
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApiService.updateItemQuantity(
        itemId,
        quantity,
      );

      if (quantity === 0) {
        toast.success("Item removed from cart");
      } else {
        toast.success(response.data?.message || "Cart updated successfully");
      }

      if (!response?.data?.cart) {
        return {
          items: [],
          totalItems: 0,
          subtotal: 0,
          total: 0,
          totalSavings: 0,
          currency: "INR",
          isEmpty: true,
          couponCode: null,
          couponDiscountAmount: 0,
        };
      }

      return response?.data?.cart;
    } catch (error) {
      console.error("updateCartItemQuantity Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "failed to update cart",
      );
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "failed to update cart",
      );
    }
  },
);

// reorder items :
export const reorderCartItems = createAsyncThunk(
  "cart/reorder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await cartApiService.reOrderItems(orderId);

      return response.data.cart;
    } catch (error) {
      console.error("error", error);
      return rejectWithValue(error || "Reorder failed");
    }
  },
);

// clear cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApiService.clearCart();
      console.log("response clear cart", response);
      toast.success("Cart cleared");
      return (
        response.data?.cart || {
          items: [],
          totalItems: 0,
          uniqueItems: 0,
          subtotal: 0,
          total: 0,
          totalSavings: 0,
          currency: "INR",
          isEmpty: true,
          couponCode: null,
          couponDiscountAmount: 0,
        }
      );
    } catch (error) {
      console.error("clearCart Error:", error);
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  },
);

// initial state
const initialState = {
  cart: null,
  items: [],
  isDrawerOpen: false,
  totalItems: 0,
  uniqueItems: 0,
  subtotal: 0,
  total: 0,
  couponCode: null,
  couponDiscountAmount: 0,
  totalSavings: 0,
  currency: "INR",
  isEmpty: true,
  loading: false,
  addingToCart: false,
  updatingItem: null,
  removingItem: null,
  error: null,
  lastAddedItem: null,
};

// helper function: enhanced to calculate totals from items
const updateCartState = (state, cartData) => {
  if (!cartData) {
    state.cart = null;
    state.items = [];
    state.totalItems = 0;
    state.uniqueItems = 0;
    state.subtotal = 0;
    state.total = 0;
    state.totalSavings = 0;
    state.currency = "INR";
    state.isEmpty = true;
    state.couponCode = null;
    state.couponDiscountAmount = 0;
    console.log("Cart is empty or null");
    return;
  }

  const items = Array.isArray(cartData?.items) ? cartData?.items : [];

  state.cart = cartData;
  state.items = items;

  const calculatedSubtotal = items.reduce(
    (sum, item) => sum + (item?.subtotal || 0),
    0,
  );
  const calculatedTotalSavings = items.reduce(
    (sum, item) => sum + (item?.savings || 0),
    0,
  );
  const calculatedTotalItems = items.reduce(
    (sum, item) => sum + (item?.quantity || 0),
    0,
  );

  state.totalItems = cartData.totalItems ?? calculatedTotalItems;
  state.uniqueItems = cartData.uniqueItems ?? items.length;
  state.subtotal = cartData.subtotal ?? calculatedSubtotal;

  // calculate total after coupon discount
  const discountAmount = cartData.couponDiscountAmount || 0;
  state.total = cartData.total ?? calculatedSubtotal - discountAmount;

  state.totalSavings = cartData.totalSavings ?? calculatedTotalSavings;
  state.currency = cartData.currency || "INR";
  state.isEmpty = cartData.isEmpty ?? items.length === 0;
  state.couponCode = cartData.couponCode || null;
  state.couponDiscountAmount = cartData.couponDiscountAmount || 0;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
    clearLastAddedItem: (state) => {
      state.lastAddedItem = null;
    },

    // reducers to control drawer from anywhere :
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },

    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.addingToCart = true;
        state.error = null;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.addingToCart = false;

        if (action.payload?.cart) {
          updateCartState(state, action.payload.cart);
        }
        state.lastAddedItem = action.payload?.addedItem || null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addingToCart = false;
        state.error = action.payload;
      })

      .addCase(updateCartItemQuantity.pending, (state, action) => {
        state.updatingItem = action.meta.arg.itemId;
        state.error = null;
      })

      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.updatingItem = null;
        updateCartState(state, action.payload);
      })

      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.updatingItem = null;
        state.error = action.payload; // just store the error, don't wipe the cart
      })

      // Remove from cart
      .addCase(removeFromCart.pending, (state, action) => {
        state.removingItem = action.meta.arg; // item id being removed
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.removingItem = null;
        updateCartState(state, action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.removingItem = null;
        state.error = action.payload;
      })

      .addCase(reorderCartItems.pending, (state) => {
        state.loading = true;
      })

      .addCase(reorderCartItems.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload);
      })

      .addCase(reorderCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload);
        state.lastAddedItem = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetCart,
  clearError,
  clearlastAddedItem,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
} = cartSlice.actions;

export const selectCartSlice = (state) => state.cart;
export const selectCart = (state) => state.cart.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartLoading = (state) => state.cart.loading;
export const selectAddingToCart = (state) => state.cart.addingToCart;
export const selectUpdatingItem = (state) => state.cart.updatingItem;
export const selectRemovingItem = (state) => state.cart.removingItem;
export const selectCartCount = (state) => state.cart.totalItems;
export const selectIsCartEmpty = (state) => state.cart.isEmpty;
export const selectCartError = (state) => state.cart.error;
export const selectTotalSavings = (state) => state.cart.totalSavings;
export const selectCouponCode = (state) => state.cart.couponCode;
export const selectCouponDiscount = (state) => state.cart.couponDiscountAmount;
export const selectLastAddedItem = (state) => state.cart.lastAddedItem;

export default cartSlice.reducer;
