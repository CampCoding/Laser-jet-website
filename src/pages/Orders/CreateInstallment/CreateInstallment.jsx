import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../features/usersSlice";
import { useTranslation } from "react-i18next";
import { fetchCategories } from "../../../features/categoriesSlice";
import { fetchProducts } from "../../../features/productsSlice";
import { toast } from "react-toastify";
import { handleCreateCart, handleCreateInstallment, handleFetchCart } from "../../../features/cartSlice";
import { Modal, Spin, Table } from "antd";
import InstallmentSelect from "../../../components/InstallmentsSelect/InstallmentSelect";
import {
  handleCreateOrder,
  handleSendOtp,
  handleVerifyCode,
} from "../../../features/ordersSlice";
import OtpInput from "react-otp-input";

const PAYMENT_METHOD = [
  {
    id: 1,
    payment_title: "كاش",
    value: "cash",
    types: ["credit", "Cash on delivery", "Cash"],
  },
  {
    id: 1,
    payment_title: "محفظة",
    value: "wallet",
    types: ["wallet"],
  },
  {
    id: 1,
    payment_title: "قسط",
    value: "installment",
    types: ["mini money"],
  },
];

export default function CreateInstallment() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
 
  });
  const [isVerified, setIsVerified] = useState(false);
  const [userData, setUSerData] = useState([]);
  const { data, loading } = useSelector((state) => state?.users);
  const { data: allCategories } = useSelector((state) => state?.categories);
  const { data: allProducts } = useSelector((state) => state?.products);
  const {
    addLoading: addOrderLoading,
    sendVerificationCodeLoading,
    verifyCodeLoading,
  } = useSelector((state) => state?.orders);
  const [otpModal, setOtpModal] = useState(false);
  const {
    data: cartData,
    loading: cartLoading,
    addLoading,
  } = useSelector((state) => state?.cart);
  const [otp, setOtp] = useState("");
  const [specificProducts, setSpecificProduct] = useState([]);
  const [createOrderData, setCreateOrderData] = useState({
    name: "",
    category: "",
    product: "",
  });

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, per_page: 10000 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsers())
      .unwrap()
      .then((res) => {
        {
          if (res?.success) {
            setUSerData(res?.data);
          }
        }
      })
      .catch((e) => console.log(e));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, per_page: 20 }));
  }, [dispatch]);

  useEffect(() => {
    if (!allProducts?.data?.products || !createOrderData?.category) {
      return;
    }

    const filteredData = allProducts.data.products.filter(
      (item) => item?.category_id == createOrderData.category
    );

    if (filteredData.length > 0) {
      setSpecificProduct(filteredData);
    } else {
      setSpecificProduct([]); // تأكد من تعيين مصفوفة فارغة إذا لم تكن هناك منتجات مطابقة
    }
  }, [allProducts, createOrderData]);

  function handleAddToCart() {
    console.log("createOrderData, createOrderData", createOrderData)
    if (!createOrderData?.user_id) {
      toast.warn("اختر مستخدم أولا!");
      return;
    }
    
    const data_send = {
     ...createOrderData
    };

    dispatch(handleCreateInstallment(data_send))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          // window.location.reload()
        } else {
          toast.error(res?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    if (createOrderData?.name)
      dispatch(handleFetchCart(+createOrderData?.name));
  }, [dispatch, createOrderData?.name]);

  const columns = [
    {
      dataIndex: "product_id",
      key: "product_id",
      title: "#",
    },
    {
      dataIndex: "",
      title: t("imageText"),
      render: (row) => <img src={row?.images?.length ? row?.images[0] : ""} />,
    },
    {
      dataIndex: "",
      key: "",
      title: t("titleText"),
      render: (row) => (
        <div className="flex flex-col gap-1">
          <h2 className="font-bold">{row?.title}</h2>
          <p className="truncate w-[400px]">{row?.description}</p>
        </div>
      ),
    },
    {
      dataIndex: "sell_price",
      key: "sell_price",
      title: t("sellPriceText"),
      render: (row) => (
        <p>
          {row} {t("egpText")}
        </p>
      ),
    },
    {
      dataIndex: "total_price",
      key: "total_price",
      title: t("totalPriceText"),
      render: (row) => (
        <p>
          {row} {t("egpText")}
        </p>
      ),
    },
    {
      render: (row) => (
        <div className="flex gap-2 items-center">
          <span
            onClick={() => {
              handleQuantity(row?.product_id);
            }}
            className="cursor-pointer bg-gray-200 text-gray-900 w-[30px] flex justify-center items-center h-[30px] p-2 rounded-md text-[20px]"
          >
            {addLoading ? <Spin size="small" /> : "+"}
          </span>
          <p>{row?.quantity}</p>
          <span
            onClick={() => {
              handleQuantity(row?.product_id, "decrement");
            }}
            className="bg-gray-200 w-[30px] h-[30px] cursor-pointer flex justify-center items-center text-gray-900 p-2 rounded-md text-[20px]"
          >
            {addLoading ? <Spin size="small" /> : "-"}
          </span>
        </div>
      ),
    },
    {
      title: t("actions"),
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              handleQuantity(row?.product_id, "delete_product");
            }}
            className="bg-blue-500 p-2 rounded-md text-white"
          >
            {addLoading ? t("loadingText") : t("deleteProduct")}
          </button>
        </div>
      ),
    },
  ];

  function handleQuantity(product_id, type) {
    let data_send;
    if (type) {
      data_send = {
        type,
        user_id: createOrderData?.name,
        product_id,
      };
    } else {
      data_send = {
        user_id: createOrderData?.name,
        product_id,
      };
    }
    dispatch(handleCreateCart(data_send))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          dispatch(handleFetchCart(+createOrderData?.name));
        } else {
          toast.error(res?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  function handleOrder() {
    if (!selectedPaymentMethod?.type) {
      toast.warn("اختر نوع الدفع أولا!");
      return;
    }

    if (!selectedPaymentMethod?.method) {
      toast.warn("اختر طريقة الدفع أولا!");
      return;
    }

    // const data_send = {
    //   payment_type: selectedPaymentMethod?.type,
    //   payment_method: selectedPaymentMethod?.method,
    //   installments: selectedPaymentMethod?.installments,
    //   user_id: selectedPaymentMethod?.user_id,
    // };

    const formData = new FormData();
    formData.append(
      "phone",
      userData?.find((item) => item?.user_id == createOrderData?.name)?.phon
    );
    formData.append("order_confirm", 1);
    dispatch(
      handleSendOtp({
        formData,
        phone: userData?.find((item) => item?.user_id == createOrderData?.name)
          ?.phone,
      })
    )
      .unwrap()
      .then((res) => {
        {
          if (res?.success) {
            toast.success(res?.message);
            setOtpModal(true);
          } else {
            toast.error(res);
          }
        }
      })
      .catch((e) => console.log(e));
    // setOtpModal(true);

    // dispatch(handleCreateOrder(data_send))
    //   .unwrap()
    //   .then((res) => {
    //     console.log(res);
    //     if (res?.success) {
    //       toast.success(res?.message);
    //       dispatch(handleFetchCart(+createOrderData?.name));
    //       setSelectedPaymentMethod({
    //         method: "",
    //         type: "",
    //         installments: [],
    //       });
    //     } else {
    //       toast.error(res);
    //     }
    //   })
    //   .catch((e) => console.log(e));
  }

  function handleVerificationCode() {
    console.log(otp);
    const data_send = {
      confirm_code: +otp,
    };
    dispatch(
      handleVerifyCode({
        body: data_send,
        phone: userData?.find((item) => item?.user_id == createOrderData?.name)
          ?.phone,
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          setIsVerified(true);
          setOtpModal(false);
        }
      });
  }

  function createOrder() {
    const data_send = {
      payment_type: selectedPaymentMethod?.type,
      payment_method: selectedPaymentMethod?.method,
      installments: selectedPaymentMethod?.installments,
      user_id: selectedPaymentMethod?.user_id || createOrderData?.name,
    };

    dispatch(handleCreateOrder(data_send))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res?.success) {
          toast.success(res?.message);
          dispatch(handleFetchCart(+createOrderData?.name));
          setSelectedPaymentMethod({
            method: "",
            type: "",
            installments: [],
          });
        } else {
          toast.error(res || res?.message || "failed to verify code");
        }
      })
      .catch((e) => console.log(e));
  }

  return (
    <div>
      <h4 className="font-semibold text-[20px] md:text-[25px] text-[#0d6efd]">
        إنشاء قسط
      </h4>
      <div className="input-group">
        <label>اسم المنتج</label>
        <input
          type="text"
          onChange={(e) =>
            setCreateOrderData({ ...createOrderData, name: e.target.value })
          }
        />
      </div>

      <div className="input-group">
        <label>عنوان الأقساط</label>
        <input
          type="text"
          onChange={(e) =>
            setCreateOrderData({ ...createOrderData, title: e.target.value })
          }
        />
      </div>
      <div className="input-group">
        <label>تاريخ بداية الأقساط</label>
        <input
          type="date"
          onChange={(e) =>
            setCreateOrderData({ ...createOrderData, date: e.target.value })
          }
        />
      </div>
      <div className="input-group">
          <label>{t("chooseUserText")}</label>
          <select
            onChange={(e) =>
              setCreateOrderData({
                ...createOrderData,
                user_id: e.target.value,
              })
            }
          >
            <option value="">{t("selectUser")}</option>
            {userData?.map((item) => (
              <option value={item?.user_id}>{item?.username}</option>
            ))}
          </select>
        </div>
      <div className="input-group">
        <label>عدد الأقساط</label>
        <input
          type="text"
          onChange={(e) =>
            setCreateOrderData({ ...createOrderData, number: e.target.value })
          }
        />
      </div>
      <div className="input-group">
        <label>قيمة الأقساط</label>
        <input
          type="text"
          onChange={(e) =>
            setCreateOrderData({ ...createOrderData, price: e.target.value })
          }
        />
      </div>

      {/* {specificProducts?.length ? (
        <div className="input-group my-4">
          <label>{t("chooseProduct")}</label>
          <select
            onChange={(e) =>
              setCreateOrderData({
                ...createOrderData,
                product: e.target.value,
              })
            }
          >
            <option value="">{t("selectProduct")}</option>

            {specificProducts.map((item) => (
              <option key={item?.product_id} value={item?.product_id}>
                {item?.title}
              </option>
            ))}
          </select>
        </div>
      ) : null} */}

      <button
        onClick={handleAddToCart}
        className="bg-[#0d6efd] my-4 text-white p-2 rounded-md"
      >
        {t("addText")}
      </button>
{/* 
      <Table
        scroll={{ x: "max-content" }}
        dataSource={cartData?.data?.length ? cartData?.data : []}
        loading={cartLoading}
        columns={columns}
      /> */}
    </div>
  );
}
