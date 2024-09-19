import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import adminSideNavigation from "../../data/AdminSideNavigation.json";
import instructorSideNavigation from "../../data/instructorSideNavigation.json";

const SideNav = () => {
  const [activePage, setActivePage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation().pathname;
  const [userRole, setUserRole] = useState("");
  const [subMenuStates, setSubMenuStates] = useState({});

  useEffect(() => {
    setActivePage(location);
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData && authData.user && authData.user.role) {
      setUserRole(authData.user.role);
    }
  }, [location]);

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubMenu = (link) => {
    setActivePage(link);
    setSubMenuStates({
      ...subMenuStates,
      [link]: !subMenuStates[link],
    });
  };

  const sideNavigationData =
    userRole === "admin"
      ? adminSideNavigation.data
      : instructorSideNavigation.data;

  return (
    <>
      <div
        className={`h-screen bg-gradient-to-t from-gray-500 to-gray-800 w-fit sticky top-0 left-0 z-50 ${
          isOpen ? "absolute md:fixed" : ""
        }`}
      >
        <div className="px-[20px] h-[64px] uppercase text-white font-bold text-xl w-full flex justify-center items-center gap-[20px]">
          <div className={`md:flex text-center ${isOpen ? "block" : "hidden"}`}>
            {userRole === "admin" ? "Admin Panel" : "Instructor Panel"}
          </div>
          <div className="text-2xl flex md:hidden hover:text-cyan-900">
            <button
              onClick={() => {
                handleMenu();
              }}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>
        <div className="grid">
          {sideNavigationData && sideNavigationData.length ? (
            sideNavigationData.map((item) => (
              <div key={item.link}>
                <Link to={item.link} onClick={() => toggleSubMenu(item.link)}>
                  <div
                    className={`px-[20px] py-[10px] w-full flex items-center gap-[10px] hover:bg-black hover:bg-opacity-20 ${
                      item.link === activePage ? "bg-black bg-opacity-40" : ""
                    }`}
                  >
                    <div className="text-white w-[24px]">
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                    <div
                      className={`text-white md:flex ${
                        isOpen && subMenuStates[item.link] ? "flex" : "hidden"
                      }`}
                    >
                      {item.name}
                    </div>
                  </div>
                </Link>
                {item.subMenu && subMenuStates[item.link] && (
                  <div className="pl-8">
                    {item.subMenu.map((subItem) => (
                      <Link key={subItem.link} to={subItem.link}>
                        <div
                          className={`px-[20px] py-[10px] w-full flex items-center gap-[10px] hover:bg-black hover:bg-opacity-20 ${
                            subItem.link === activePage
                              ? "bg-black bg-opacity-40"
                              : ""
                          }`}
                        >
                          <div className="text-white w-[24px]">
                            <FontAwesomeIcon icon={subItem.icon} />
                          </div>
                          <div
                            className={`text-white md:flex ${
                              isOpen ? "flex" : "hidden"
                            }`}
                          >
                            {subItem.name}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default SideNav;
