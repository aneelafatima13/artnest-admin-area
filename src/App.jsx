import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/login";
import Home from "./pages/home";
import ManageRoles from "./pages/ManageRoles";
import ManageRights from "./pages/ManageRights";
import AssignRights from "./pages/AssignRights";
import ManageUsers from "./pages/ManageUsers";
import ManageCategories from "./pages/ManageCategories";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import DeliveriesTypes from "./pages/DeliveriesTypes";

function App() {
  const user = sessionStorage.getItem("user"); // check session

  return (
    <>
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <BrowserRouter>
        <Routes>
          {/* Default route → Login */}
          <Route path="/" element={<Login />} />

          {/* Protected routes → only accessible if logged in */}
          <Route
            path="/home"
            element={user ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/manageroles"
            element={user ? <ManageRoles /> : <Navigate to="/" />}
          />
          <Route
            path="/managerights"
            element={user ? <ManageRights /> : <Navigate to="/" />}
          />
          <Route
            path="/assignrights"
            element={user ? <AssignRights /> : <Navigate to="/" />}
          />
          <Route
            path="/manageusers"
            element={user ? <ManageUsers /> : <Navigate to="/" />}
          />
          <Route
            path="/managecategories"
            element={user ? <ManageCategories /> : <Navigate to="/" />}
          />
          <Route
            path="/products"
            element={user ? <Products /> : <Navigate to="/" />}
          />
          <Route
            path="/orders"
            element={user ? <Orders /> : <Navigate to="/" />}
          />
          <Route
            path="/DeliveriesTypes"
            element={user ? <DeliveriesTypes /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
