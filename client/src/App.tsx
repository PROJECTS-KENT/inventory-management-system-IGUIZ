import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Inventory from "./pages/Inventory";
import StockTransaction from "./pages/StockTransaction";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/Users";
import ProductDetails from "./pages/ProductDetails";
import Reports from "./pages/Reports";
import RoleRoute from "./components/RoleRoute";
import ActivityLogs from "./pages/ActivityLogs";
import Orders from "./pages/Orders";
import OrderInvoice from "./pages/OrderInvoice";

// Customer
import Store from "./customer/pages/Store";
import Cart from "./customer/pages/Cart";
import Checkout from "./customer/pages/CheckOut";
import ThankYou from "./customer/pages/ThankYou";
import TrackOrder from "./customer/pages/TrackOrder";
import Profile from "./customer/pages/Profile";
import EditProfile from "./customer/pages/EditProfile";
import GoogleSuccess from "./customer/pages/GoogleSuccess";
import OrderDetails from "./customer/pages/OrderDetails";
import CustomerProtectedRoute from "./customer/components/CustomerProtectedRoute";

function App() {
  return (
    <Routes>

      {/* ================= CUSTOMER ================= */}

      <Route path="/" element={<Store />} />

      <Route path="/store" element={<Store />} />

      <Route path="/cart" element={<Cart />} />

      <Route path="/checkout" element={<Checkout />} />

      <Route
        path="/customer/profile"
        element={
          <CustomerProtectedRoute>
            <Profile />
          </CustomerProtectedRoute>
        }
      />

      <Route
        path="/customer/profile/edit"
        element={
          <CustomerProtectedRoute>
            <EditProfile />
          </CustomerProtectedRoute>
        }
      />

      {/* NEW */}
      <Route
        path="/customer/orders/:id"
        element={
          <CustomerProtectedRoute>
            <OrderDetails />
          </CustomerProtectedRoute>
        }
      />

      <Route
        path="/thank-you/:reference"
        element={<ThankYou />}
      />

      <Route
        path="/track-order"
        element={<TrackOrder />}
      />

      <Route
        path="/customer/auth/success"
        element={<GoogleSuccess />}
      />

      {/* ================= ADMIN LOGIN ================= */}

      <Route path="/admin" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* ================= ADMIN ================= */}

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/new"
          element={<AddProduct />}
        />

        <Route
          path="/products/edit/:id"
          element={<EditProduct />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/inventory"
          element={<Inventory />}
        />

        <Route
          path="/inventory/transaction"
          element={<StockTransaction />}
        />

        <Route
          path="/categories"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Categories />
            </RoleRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Suppliers />
            </RoleRoute>
          }
        />

        <Route
          path="/users"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Users />
            </RoleRoute>
          }
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/activity"
          element={<ActivityLogs />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />
      </Route>

      <Route
        path="/orders/:id/invoice"
        element={<OrderInvoice />}
      />

    </Routes>
  );
}

export default App;