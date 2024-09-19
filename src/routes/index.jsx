import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "antd/dist/reset.css";
import CommonLayout from "../layouts/CommonLayout";
import SignIn from "../layouts/CommonLayout/SignIn";
import CategoryLayout from "../layouts/CategoryLayout";
import ProductLayout from "../layouts/ProductLayout";
import InventoryLayout from "../layouts/InventoryLayout";

const FrontendRoutes = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<CommonLayout />}>
            <Route path="/" element={<SignIn />} />
            <Route path="signup" />
          </Route>

          <Route path="category" element={<CategoryLayout />}>
            <Route path="view-category" />
            <Route path="add-category" />
            <Route path="view-category-details/:id" />
            <Route path="update-category/:id" />
          </Route>

          <Route path="product" element={<ProductLayout />}>
            <Route path="view-product" />
            <Route path="add-product" />
            <Route path="view-product-details/:id" />
            <Route path="update-product/:id" />
          </Route>

          <Route path="inventory" element={<InventoryLayout />}>
            <Route path="view-inventory" />
            <Route path="add-inventory" />
            <Route path="view-inventory-details/:id" />
            <Route path="update-inventory/:id" />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default FrontendRoutes;