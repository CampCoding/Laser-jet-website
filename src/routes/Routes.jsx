import { Route, Routes } from "react-router-dom";
import { getRoutesData } from "./routesData";
import { lazy , Suspense } from "react";
import { useSelector } from "react-redux";

export default function AppRoutes() {
  const {user_permissions} = useSelector(state => state?.login)
  const routesData = getRoutesData(user_permissions)
  return (
    <Routes>
      
      {routesData.map((item) =>
        item?.subMenus?.length > 0 ? (
          item?.subMenus.map((ele) => (
            <Route path={ele.path} element={<ele.component />} key={ele?.id} />
          ))
        ) : (
          <Route path={item.path} element={<item.component />} key={item?.id} />
        )
      )}
    </Routes>
  );
}
