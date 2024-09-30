import React from "react";
import { Route, Routes } from "react-router-dom";
import SideNav from "../../components/SideNav";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import ViewCategory from "./ViewInventory";
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";
import ViewInventory from "./ViewInventory";

const InventoryLayoutAdmin = () => {
  return (
    <>
      <Header />
      <div className="flex sticky top-0 left-0">
        <SideNav />
        <div className="flex flex-col flex-1" style={{ marginTop: "40px" }}>
          <div className="overflow-y-scroll pt-10 ml-10 mr-10">
            <Outlet />
            <Routes>
              <Route>
                <Route path="view-inventory" element={<ViewInventory />} />
                <Route path="add-category" element={<AddCategory />} />
                <Route
                  path="update-category/:id"
                  element={<UpdateCategory />}
                />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryLayoutAdmin;
