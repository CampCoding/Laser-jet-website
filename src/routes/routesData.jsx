import {
  FaBell,
  FaCalendarDays,
  FaFileInvoice,
  FaGlobe,
  FaHouse,
  FaJediOrder,
  FaMoneyBill,
  FaMoneyBill1Wave,
  FaMotorcycle,
  FaPalette,
  FaTabletScreenButton,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import { conifgs } from "../config/index";
import HomePage from "../pages/HomePage/HomePage";
import UsersPage from "../pages/UsersPage/UsersPage";
import AccountRequestsPage from "../pages/AccountRequestsPage/AccountRequestsPage";
import UserDocs from "../pages/UserDocs/UserDocs";
import SendBalancePage from "../pages/SendBalancePage/SendBalancePage";
import UsersBalance from "../pages/UsersBalance/UsersBalance";
import InstallmentsPage from "../pages/InstallmentsPage/InstallmentsPage";
import InstallmentsLogs from "../pages/InstallmentsLogs/InstallmentsLogs";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import BannersPage from "../pages/BannersPage/BannersPage";
import EmployeePage from "../pages/EmployeePage/EmployeePage";
import EmployeeDocs from "../pages/EmployeeDocs/EmployeeDocs";
import PermissionsPage from "../pages/PermissionsPage/PermissionsPage";
import { IoBanSharp } from "react-icons/io5";
import ProductSections from "../pages/ProductSections/ProductSections";
import ProductRequests from "../pages/ProductRequests/ProductRequests";
import ProductRequestDetails from "../pages/ProductRequestDetails/ProductRequestDetails";
import ProductOrder from "../pages/ProductOrder/ProductOrder";
import UserProfile from "../pages/UsersPage/UserProfile/UserProfile";
import UserBalances from "../pages/UsersPage/UserBalances/UserBalances";
import UserFinancialtransactions from "../pages/UsersPage/UserFinancialtransactions/UserFinancialtransactions";
import UserDeductions from "../pages/UserDeductions/UserDeductions";
import Operations from "../pages/Operations/Operations";
import Notifications from "../pages/Notifications/Notifications";
import Invoices from "../pages/Invoices/Invoices";
import DeliveryAreas from "../pages/DeliveryAreas/DeliveryAreas";
import UserOrders from "../pages/UsersPage/UserOrders/UserOrders";
import LoginPage from "../pages/LoginPage/LoginPage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import { FcSettings } from "react-icons/fc";
import AboutUs from "../pages/AboutUs/AboutUs";
import Orders from "../pages/Orders/Orders";
import OrderDetails from "../pages/Orders/OrderDetails/OrderDetails";
import CreateOrder from "../pages/Orders/CreateOrder/CreateOrder";
import InvoiceDetails from "../pages/Invoices/InvoiceDetails/InvoiceDetails";
import OffersPage from "../pages/OffersPage/OffersPage";
import EmployeeProfile from "../pages/EmployeePage/EmployeeProfile/EmployeeProfile";
import CreateInstallment from "../pages/Orders/CreateInstallment/CreateInstallment";
import Permissions from "../pages/PermissionsPage/Permissions";
import UserPermissions from "../pages/PermissionsPage/UserPermissions";
import { components } from "react-select";
import AdminsTransactions from "../pages/AdminsTransactions/AdminsTransactions";
import AdminFinanceTransactions from "../pages/AdminsTransactions/AdminFinanceTransaction/AdminFinanceTransaction";
import RolePermissionsPage from "../pages/PermissionsPage/RolePermissionsPage";

export const getRoutesData = (userPermissions = []) => {
  const check = (permission_id) =>
    userPermissions?.some((item) => item?.permission_id === permission_id);

  // Permission checks mapped to provided IDs
  const canManageUsers = check("4");
  const canViewUsers = check("5");
  const canManageRoles = check("9");
  const canViewRoles = check("10");
  const canManagePermissions = check("14");
  const canViewPermissions = check("15");
  const canManageProducts = check("19");
  const canViewProducts = check("20");
  const canManageOrders = check("24");
  const canViewOrders = check("25");
  const canManageWallet = check("28");
  const canViewWallet = check("29");
  const canAddWalletBalance = check("30");
  const canWithdrawWalletBalance = check("31");
  const canManageReports = check("32");
  const canViewReports = check("33");
  const canExportReports = check("34");
  const canManageUserDocs = check("37");
  const canManageInstallments = check("39");
  const canManageUserFinance = check("40");
  const canManageCategories = check("41");
  const canManageBanners = check("43");
  const canManageOffers = check("44");
  const canManageSettings = check("45");
  const canManageEmployees = check("46");
  const canManageEmployeeFinance = check("47");
  const canManageNotifications = check("48");
  const canManageGeneralSettings = check("50");
  const canManagePromotions = check("51");
  const canManageDeliveryAreas = check("52");
  const canViewDeliveryAreas = check("53");

  return [
    {
      id: 1,
      labelAr: "الرئيسية",
      labelEn: "Home",
      path: "/",
      component: HomePage,
      icon: FaHouse,
      hidden: false,
    },
    {
      id: 2,
      labelAr: "المستخدمين",
      labelEn: "Users",
      path: "/users",
      component: UsersPage,
      icon: FaUser,
      hidden: !(canViewUsers || canManageUsers),
      subMenus: [
        {
          id: 1,
          labelAr: "المستخدمين",
          labelEn: "Users",
          path: "/users",
          component: UsersPage,
          icon: FaUser,
          hidden: false,
        },
        {
          id: 89,
          labelAr: "الأقساط",
          labelEn: "Create Installment",
          path: "/CreateInstallment",
          component: CreateInstallment,
          icon: FaTabletScreenButton,
          hidden: !canManageInstallments,
        },
        {
          id: 2,
          labelAr: "المعاملات المالية للمستخدمين ",
          labelEn: "Financing Transactions",
          icon: FaMoneyBill1Wave,
          path: "/user_finance_transactions",
          component: UserFinancialtransactions,
          hidden: !canManageUserFinance,
        },
      ],
    },
    {
      id: 3,
      labelAr: "طلبات الحسابات",
      labelEn: "Account Requests",
      path: "/account-requests/:user_id",
      component: AccountRequestsPage,
      icon: "",
      hidden: true,
    },
    {
      id: 4,
      labelAr: "",
      labelEn: "",
      path: "/user_docs/:userId",
      component: UserDocs,
      icon: "",
      hidden: true,
    },
    {
      id: 5,
      labelAr: "",
      labelEn: "",
      path: "/send_balance/:userId",
      component: SendBalancePage,
      icon: "",
      hidden: true,
    },
    {
      id: 8,
      labelAr: "",
      labelEn: "",
      path: "/installments_logs/:id",
      component: InstallmentsLogs,
      icon: "",
      hidden: true,
    },

    {
      id: 11,
      labelAr: "الموقع",
      labelEn: "website",
      icon: FaGlobe,
      hidden: false,
      subMenus: [
        {
          id: 1,
          labelAr: "الفئات",
          labelEn: "Category",
          path: "/categories",
          component: ProductSections,
          icon: FaTabletScreenButton,
          hidden: !canManageCategories,
        },
        {
          id: 2,
          labelAr: "المنتجات",
          labelEn: "Products",
          path: "/products",
          component: ProductsPage,
          icon: FaTabletScreenButton,
          hidden: !(canViewProducts || canManageProducts),
        },

        {
          id: 2,
          labelAr: "العروض",
          labelEn: "Offers",
          path: "/offers",
          component: OffersPage,
          icon: FaTabletScreenButton,
          hidden: !canManageOffers,
        },
        {
          id: 3,
          labelAr: "البانرات",
          labelEn: "Banners",
          path: "/banners",
          component: BannersPage,
          icon: FaPalette,
          hidden: !canManageBanners,
        },
        // {
        //   id:3,
        //   labelAr:"نبذه عنا",
        //   labelEn:"About Us",
        //   component:AboutUs ,
        //   icon: FaUser,
        //   hidden:false,
        //   path:"/about-us"
        // },
        {
          id: 5,
          labelAr: "الاعدادات",
          labelEn: "Settings",
          path: "/settings",
          component: SettingsPage,
          icon: FcSettings,
          hidden: !(canManageSettings || canManageGeneralSettings),
        },
      ],
    },
    {
      id: 25,
      labelAr: "الطلبات",
      labelEn: "Orders",
      component: Orders,
      icon: FaJediOrder,
      path: "/orders",
      hidden: !(canViewOrders || canManageOrders),
    },

    {
      id: 26,
      labelAr: "تفاصيل الطلب",
      labelEn: "Order Details",
      component: OrderDetails,
      icon: FaJediOrder,
      path: "/ordersDetails/:id",
      hidden: true,
    },
    {
      id: 13,
      labelAr: "الموظفين",
      labelEn: "Employee Docs",
      path: "/employee-docs/:id",
      component: EmployeeDocs,
      icon: FaUsers,
      hidden: true,
    },
    {
      id: 12,
      labelAr: "الموظفين",
      labelEn: "Employee",
      path: "/employee",
      component: EmployeePage,
      icon: FaUsers,
      hidden: !canManageEmployees,
      subMenus: [
        {
          id: 1,
          labelAr: "الموظفين",
          labelEn: "Employee",
          path: "/employee",
          component: EmployeePage,
          icon: FaUsers,
          hidden: false,
        },
        {
          id: 12,
          labelAr: "الادوار",
          labelEn: "Roles",
          path: "/permissions",
          component: PermissionsPage,
          icon: IoBanSharp,
          hidden: !(canViewRoles || canManageRoles),
        },
        {
          id: 2,
          labelAr: "المعاملات المالية",
          labelEn: "Transactions",
          path: "/admin-transaction",
          component: AdminsTransactions,
          icon: FaMoneyBill,
          hidden: !canManageEmployeeFinance,
        },
      ],
    },
    {
      id: 2,
      labelAr: "الموظفين",
      labelEn: "Employee",
      path: "/employee_profile/:id",
      component: EmployeeProfile,
      icon: FaUsers,
      hidden: true,
    },
    {
      id: 22,
      labelAr: "الايصالات",
      labelEn: "Invoices",
      path: "/invoices",
      component: Invoices,
      icon: FaFileInvoice,
      hidden: !(canViewReports || canManageReports),
    },
    {
      id: 23,
      labelAr: "مناطق التوصيل",
      labelEn: "Delivery Areas",
      path: "/delivery_areas",
      component: DeliveryAreas,
      icon: FaMotorcycle,
      hidden: !(canViewDeliveryAreas || canManageDeliveryAreas),
    },
    {
      id: 24,
      labelAr: "الاوردرات",
      labelEn: "Orders",
      path: "/user_orders/:userId",
      component: UserOrders,
      icon: FaMotorcycle,
      hidden: true,
    },
    {
      id: 15,
      labelAr: "طلبات المنتجات",
      labelEn: "Products Request",
      path: "/product_requests/:offer_id",
      component: ProductRequests,
      icon: IoBanSharp,
      hidden: true,
    },
    {
      id: 16,
      labelAr: "عرض الطلب",
      labelEn: "Products Request Details",
      path: "/product_requests_details/:id",
      component: ProductRequestDetails,
      icon: IoBanSharp,
      hidden: true,
    },
    {
      id: 17,
      labelAr: "عرض الطلب",
      labelEn: "Products Order",
      path: "/product_orders/:id",
      component: ProductOrder,
      icon: IoBanSharp,
      hidden: true,
    },
    {
      id: 18,
      labelAr: "تفاصيل العميل",
      labelEn: "User Profile",
      path: "/profile_user/:userId",
      component: UserProfile,
      icon: IoBanSharp,
      hidden: true,
    },
    {
      id: 19,
      labelAr: "رصيد المستخدم",
      labelEn: "User Balance",
      path: "/user_balance/:id",
      component: UserBalances,
      icon: IoBanSharp,
      hidden: true,
    },
    {
      id: 20,
      labelAr: "",
      labelEn: "",
      path: "/user_finance_transactions/:userId",
      component: UserFinancialtransactions,
      hidden: true,
      icon: "",
    },
    // {
    //   id: 50,
    //   labelAr: "المعاملات المالية",
    //   labelEn: "Financing Transactions",
    //   icon: FaMoneyBill1Wave,
    //   path: "/user_finance_transactions",
    //   component: UserFinancialtransactions,
    //   hidden: false,
    // },
    {
      id: 21,
      labelAr: "الاشعارات",
      labelEn: "Notifications",
      path: "/notifications",
      component: Notifications,
      hidden: !canManageNotifications,
      icon: FaBell,
    },

    {
      id: 22,
      hidden: true,
      component: LoginPage,
      path: "/login",
    },
    {
      id: 27,
      hidden: true,
      component: CreateOrder,
      path: "/create_order",
    },
    {
      id: 28,
      hidden: true,
      component: ProductOrder,
      path: "/product_order/:product_id",
    },
    {
      id: 29,
      labelAr: "الايصالات",
      labelEn: "Invoices Details",
      path: "/invoices_details",
      component: InvoiceDetails,
      icon: FaFileInvoice,
      hidden: true,
    },
    {
      id: 30,
      labelAr: "الصلاحيات",
      labelEn: "Permissions",
      path: "/all_permission",
      component: Permissions,
      icon: IoBanSharp,
      hidden: !(canViewPermissions || canManagePermissions),
    },
    {
      id: 31,
      labelAr: "صلاحيات الموظفين",
      labelEn: "Users_Permissions",
      path: "/user_permissions/:id",
      component: UserPermissions,
      icon: IoBanSharp,
      hidden: true,
    },
    {
      id: 32,
      labelAr: "صلاحيات الموظفين",
      labelEn: "Users_Permissions",
      path: "/admin_transactions/:id",
      component: AdminFinanceTransactions,
      icon: IoBanSharp,
      hidden: true,
    },
    {
      id: 33,
      labelAr: "صلاحيات الموظفين",
      labelEn: "Users_Permissions",
      path: "/role-permissions/:id",
      component: RolePermissionsPage,
      icon: IoBanSharp,
      hidden: true,
    },
  ];
};
