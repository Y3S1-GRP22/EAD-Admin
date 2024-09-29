import SideNav from "../../components/SideNav";
import Header from "../../components/Header";
import { Outlet, Route, Routes } from "react-router-dom";
import AdminProfile from "./profile";
import Dashboard from "./Dashboard";

const AdminLayout = () => {
  return (
    <>
      <Header />
      <div className="flex sticky top-0 left-0">
        <SideNav />
        <div className="flex flex-col flex-1" style={{ marginTop: "60px" }}>
          {" "}
          {/* Adjust the marginTop value as needed */}
          <div className="overflow-y-scroll h-full">
            {" "}
            {/* Ensure the container takes full height */}
            <Outlet />
            <Routes>
              <Route>
                <Route path="profile" element={<AdminProfile />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
