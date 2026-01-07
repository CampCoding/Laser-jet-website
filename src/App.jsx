import React, { useEffect, useRef } from "react";
import DefaultLayout from "./Layout/DefaultLayout/DefaultLayout";
import AppRoutes from "./routes/Routes";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, refreshToken } from "./features/loginSlice";
import { conifgs } from "./config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginPage from "./pages/LoginPage/LoginPage";
import CameraView from "./testComponent";

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const language = localStorage?.getItem("accept-language");
  const { data, userProfileData, error } = useSelector((state) => state?.login);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const token = Cookies.get("laserget_refresh_token");
    if (!token) {
      navigate("/login");
      // return <LoginPage />;
    }

    const refreshAuthToken = async () => {
      try {
        const res = await dispatch(refreshToken()).unwrap();
        if (res?.success) {
          localStorage.setItem(conifgs.localStorageTokenName, res?.data);
        } else {
          throw new Error(res?.message || "Failed to refresh token");
        }
      } catch (e) {
        toast.error(error.message);
        localStorage.removeItem(conifgs.localStorageTokenName);
        Cookies.remove("laserget_refresh_token");
        navigate("/login");
      }  
    };

    refreshAuthToken();

    intervalRef.current = setInterval(refreshAuthToken, 600000);

    return () => clearInterval(intervalRef.current);
  }, [dispatch, navigate]);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    console.log(language);
    if (language == "ar") {
      document.body.dir = "rtl";
    } else {
      document.body.dir = "ltr";
    }
  }, [language]);

  return (
    <div>
      {/* <CameraView /> */}
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
      <ToastContainer />
    </div>
  );
}
