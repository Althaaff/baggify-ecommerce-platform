import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";

console.log("📦 Importing cartReducer:", typeof cartReducer);

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

console.log("📦 Store created. Initial state:", store.getState());

export { store };
export default store;
