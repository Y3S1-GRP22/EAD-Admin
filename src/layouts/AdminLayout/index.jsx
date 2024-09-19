import React from "react";
import SideNav from "../../components/SideNav";
import Header from "../../components/Header";
import { Outlet, Route, Routes } from "react-router-dom";
import AdminProfile from "./Profile";
import Dashboard from "./Dashboard";

const AdminLayout = () => {
  return (
    <>
      <Header />
      <div className="flex sticky top-0 left-0">
        <SideNav />
        <div className="flex flex-col flex-1">
          <div className="overflow-y-scroll">
            <Outlet />
            <Routes>
              <Route>
                <Route path="profile" element={<AdminProfile />} />
                <Route path="admin" element={<Dashboard />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
