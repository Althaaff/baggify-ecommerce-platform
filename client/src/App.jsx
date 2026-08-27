import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/layout/UserLayout";
import Home from "./pages/Home";
import ProductDetailsPage from "./pages/products/ProductDetailsPage";
import LoginPage from "./pages/auth/LoginPage";
import MyOrdersPage from "./pages/orders/MyOrdersPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { SettingsPage } from "./pages/profile/SettingsPage";
import OrderDetailsPage from "./pages/orders/OrderDetailsPage";
import CheckOutPage from "./pages/checkout/CheckOutPage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import ProductsManagement from "./components/admin/ProductsManagement";
import EditProductPage from "./components/admin/EditProduct";
import OrderManagement from "./components/admin/OrderManagement";
import AdminLayout from "./components/admin/AdminLayout";
import UserManagement from "./components/admin/UserManagement";
import SearchPage from "./pages/search/SearchPage";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useCart from "./hooks/useCart";
import PaymentPage from "./pages/checkout/PaymentPage";
import OrderSuccessPage from "./pages/checkout/OrderSuccessPage";
import ScrollToTop from "./components/common/ScrollToTop";
import "../src/styles/paymentPage.css";
import CollectionPage from "./pages/products/CollectionPage";

function App() {
  const { loadCart } = useCart();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <Routes>
          {/* User Route */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<LoginPage />} />
            <Route
              path="collections/:categorySlug"
              element={<CollectionPage />}
            />
            <Route
              path="collections/:categorySlug/products/:productSlug"
              element={<ProductDetailsPage />}
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <MyOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route path="checkout" element={<CheckOutPage />} />

            <Route
              path="payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders-success/:orderId"
              element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              }
            />
            {/* search page */}
            <Route path="search" element={<SearchPage />} />
            <Route
              path="products/:productSlug"
              element={<ProductDetailsPage />}
            />

            {/* Admin Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductsManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route
                path="products/:productId/edit"
                element={<EditProductPage />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
