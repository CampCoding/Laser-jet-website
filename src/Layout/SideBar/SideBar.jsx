import React, { useEffect, useState } from "react";
import { getRoutesData } from "../../routes/routesData";
import { NavLink, useNavigate } from "react-router-dom";
import { Drawer } from "antd";
import {
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import { conifgs } from "../../config";
import LoginPage from "../../pages/LoginPage/LoginPage";
import { useSelector } from "react-redux";

export default function SideBar({ open, setOpen }) {
  const [activeMenus, setActiveMenus] = useState({});
  const navigate = useNavigate();
  const lang = localStorage.getItem("accept-language") || "ar";
  const toggleMenu = (index) => {
    setActiveMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const { user_permissions } = useSelector((state) => state?.login);
  const routesData = getRoutesData(user_permissions);

  function handleLogout() {
    localStorage.removeItem(conifgs.localStorageTokenName);
    // navigate("/login")
    return <LoginPage />;
  }

  return (
    <Drawer
      width="300px"
      placement={lang == "ar" ? "right" : "left"}
      onClose={() => setOpen(false)}
      open={open}
    >
      <img
        className="w-[140px] mx-auto h-[50px] object-cover"
        src="https://laserjet-8405a.web.app/media/logos/logo.png"
      />
      <ul className="flex flex-col gap-4 my-3">
        {routesData
          ?.filter((item) => !item?.hidden)
          ?.map((item, index) =>
            item?.subMenus?.length > 0 ? (
              <>
                <li
                  onClick={() => toggleMenu(index)}
                  className="text-[#0d6efd] flex justify-between items-center p-3 cursor-pointer"
                  key={index}
                >
                  <div className="flex gap-2 items-center">
                    <item.icon />
                    <span className="cursor-pointer">
                      {lang == "ar" ? item?.labelAr : item?.labelEn}
                    </span>
                  </div>
                  <div>
                    {activeMenus[index] ? <FaAngleDown /> : <FaAngleLeft />}
                  </div>
                </li>

                {activeMenus[index] && (
                  <ul className="bg-white rounded-lg  ">
                    {item?.subMenus?.map((ele) =>
                      ele?.hidden ? null : (
                        <NavLink
                          key={index}
                          to={ele?.path}
                          className={({ isActive }) =>
                            isActive
                              ? "!bg-[#0d6efd] !text-white p-3 rounded-md flex gap-3 items-center"
                              : "text-[#0d6efd] flex p-3 gap-3 items-center"
                          }
                        >
                          <item.icon />
                          <span>
                            {lang == "ar" ? ele?.labelAr : ele?.labelEn}
                          </span>
                        </NavLink>
                      )
                    )}
                  </ul>
                )}
              </>
            ) : (
              <>
                <NavLink
                  key={index}
                  to={item?.path}
                  className={({ isActive }) =>
                    isActive
                      ? "!bg-[#0d6efd] !text-white p-3 rounded-md flex gap-3 items-center"
                      : "text-[#0d6efd] flex p-3 gap-3 items-center"
                  }
                >
                  <item.icon />
                  <span>{lang == "ar" ? item?.labelAr : item?.labelEn}</span>
                </NavLink>
              </>
            )
          )}
        <NavLink
          onClick={handleLogout}
          className={({ isActive }) =>
            isActive
              ? "!bg-[#0d6efd] !text-white p-3 rounded-md flex gap-3 items-center"
              : "text-[#0d6efd] flex p-3 gap-3 items-center"
          }
        >
          <FaArrowRightFromBracket />
          <span>{lang == "ar" ? "تسجيل خروج" : "Logout"}</span>
        </NavLink>
      </ul>
    </Drawer>
  );
}
