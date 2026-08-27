import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";

import {
  fetchCart,
  addToCart as addToCartAction,
  clearCart as clearCartAction,
  removeFromCart as removeCartAction,
  selectCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectCartLoading,
  selectAddingToCart,
  selectIsCartEmpty,
  selectLastAddedItem,
  updateCartItemQuantity,
} from "../features/cart/cartSlice.js";

const useCart = () => {
  const dispatch = useDispatch();

  // selectors :
  const cart = useSelector(selectCart);
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartCount);
  const isEmpty = useSelector(selectIsCartEmpty);
  const loading = useSelector(selectCartLoading);
  const addingToCart = useSelector(selectAddingToCart);
  const updatingItem = useSelector((state) => state.cart.updatingItem);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const savings = useSelector((state) => state.cart.totalSavings);
  const removingItem = useSelector((state) => state.cart.removingItem);
  const lastAddedItem = useSelector(selectLastAddedItem);

  // actions :
  const loadCart = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const addToCart = useCallback(
    ({ productId, quantity }) => {
      return dispatch(addToCartAction({ productId, quantity }));
    },
    [dispatch],
  );

  const handleUpdateQuantity = useCallback(
    ({ itemId, quantity }) => {
      return dispatch(updateCartItemQuantity({ itemId, quantity }));
    },
    [dispatch],
  );

  const handleIncrementQuantity = useCallback(
    ({ itemId, currentQuantity }) => {
      console.log("itemId quantity", itemId, currentQuantity);
      return dispatch(
        updateCartItemQuantity({ itemId, quantity: currentQuantity + 1 }),
      );
    },
    [dispatch],
  );

  const handleDecrementQuantity = useCallback(
    ({ itemId, currentQuantity }) => {
      if (currentQuantity <= 1) {
        return dispatch(removeCartAction(itemId));
      }

      return dispatch(
        updateCartItemQuantity({
          itemId,
          quantity: currentQuantity - 1,
        }),
      );
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (itemId) => {
      return dispatch(removeCartAction(itemId));
    },
    [dispatch],
  );

  const clearAllItems = useCallback(() => {
    return dispatch(clearCartAction());
  }, [dispatch]);

  // check if specific item is in cart :
  let isInCart = useCallback(
    (productId) => {
      return items.some((item) => {
        let matches =
          item.productId === productId || item.product?._id === productId;

        return matches;
      });
    },
    [items],
  );

  let isItemUpdating = useCallback(
    (itemId) => {
      return updatingItem === itemId;
    },
    [updatingItem],
  );

  let isItemRemoving = useCallback(
    (itemId) => {
      return removingItem === itemId;
    },
    [removingItem],
  );

  return {
    // State
    cart,
    items,
    total,
    subtotal,
    itemCount,
    isEmpty,
    loading,
    addingToCart,
    updateQuantity: handleUpdateQuantity,
    incrementQuantity: handleIncrementQuantity,
    decrementQuantity: handleDecrementQuantity,
    removingItem,
    savings,
    lastAddedItem,
    cartCount: totalItems,

    // Actions
    loadCart,
    addToCart,
    clearAllItems,
    removeItem,

    // Helper functions
    isInCart,
    isItemRemoving,
    isItemUpdating,
  };
};

export default useCart;
