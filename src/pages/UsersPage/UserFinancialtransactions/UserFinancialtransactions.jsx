import { useEffect, useState } from "react";
import UsersBalance from "../UserBalances/UserBalances";
import UserInstallrments from "../UserInstallments/UserInstallments.jsx";
// import UserInstallments from "../UserInstallments/UserInstallments";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserProfile } from "../../../features/loginSlice.js";
import { fetchTransactionsData } from "../../../features/usersSlice.js";
import UserDeductions from "../UserDeductions/UserDeductions";
import UserManualInstallrments from "../UserInstallments/UserManualInstallrments.jsx";
import UserOperations from "../UserOperations/UserOperations";

export default function UserFinancialtransactions() {
  const [tabs, setTabs] = useState(1);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { userProfileData } = useSelector((state) => state?.login);
  const [permissions, setPermissions] = useState([]);

  // // const canAddOrder = permissions?.some((item) => item?.name === "إضافة مستخدم");
  // const canEditOrder = permissions?.some((item) => item?.name === "تعديل حالة الطلب");
  // const canDeleteOrder = permissions?.some((item) => item?.name === "حذف طلب");
  // const canShowAllOrder = permissions?.some(item => item?.name === "إدارة الطلبات");
  const canManagementWallet = permissions?.some(
    (item) => item?.permission_id == 26
  );

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    setPermissions(userProfileData?.permissions);
  }, [userProfileData]);

  const TABS = [
    {
      id: 1,
      nameAr: t("walletBalance"),
    },
    {
      id: 2,
      nameAr: t("InstallmentsText"),
    },
    {
      id: 3,
      nameAr: t("fines"),
    },
    {
      id: 4,
      nameAr: t("operationText"),
    },
    // {
    //   id: 5,
    //   nameAr: "الأقساط المضافة يدويا",
    // },
  ];
  const { userId } = useParams();

  const [userProfile, setUserProfile] = useState({});
  useEffect(() => {
    dispatch(fetchTransactionsData(userId)).then((res) => {
      setUserProfile(res?.payload?.data);
    });
  }, [userId]);

  return (
    <div>
      <h3 className="text-center my-5 text-[23px] text-[#0d6efd] font-bold">
        {t("financeTransactionsText")}
      </h3>
      <div className="flex gap-3 items-center">
        {TABS.map((item) => (
          <button
            className={`p-3 border border-[#0d6efd] rounded-md flex justify-center items-center ${
              tabs == item?.id
                ? "bg-[#0d6efd] text-white"
                : "bg-transparent text-[#0d6efd]"
            }`}
            key={item?.id}
            onClick={() => setTabs(item?.id)}
          >
            {item?.nameAr}
          </button>
        ))}
        {/* <button className={`p-3 border border-[#0d6efd] ${tabs == 0}`} onClick={() => setTabs(0)}>رصيد الحساب</button> */}
      </div>
      {console.log(
        "installments",
        !userId
          ? userProfile?.installments?.map((item) => item?.data)
          : userProfile?.installments
      )}
      {tabs == 1 && canManagementWallet && (
        <UsersBalance userProfile={userProfile?.wallet} userId={userId} />
      )}
      {tabs == 2 && (
        <UserInstallrments userProfile={userProfile?.installments} />
      )}
      {tabs == 3 && <UserDeductions userProfile={userProfile?.fines} />}
      {tabs == 5 && (
        <UserManualInstallrments
          userProfile={userProfile?.installmentsManual}
        />
      )}
      {tabs == 4 && (
        <UserOperations
          userProfile={
            userProfile?.transactions &&
            userProfile?.transactions?.length &&
            userProfile?.transactions?.sort((a, b) => {
              return parseInt(b?.id) - parseInt(a?.id);
            })
          }
        />
      )}
    </div>
  );
}
