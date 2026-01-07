import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../features/usersSlice";
import { useTranslation } from "react-i18next";
import { fetchCategories } from "../../../features/categoriesSlice";
import { fetchProducts } from "../../../features/productsSlice";
import { toast } from "react-toastify";
import { handleCreateCart, handleFetchCart } from "../../../features/cartSlice";
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
    types: ["credit", "Cash on delivery" ,"Cash"],
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

export default function CreateOrder() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
    type: "",
    method: "",
    user_id: null,
    installments: [],
  });
  const [isVerified , setIsVerified] = useState(false);
  const [userData, setUSerData] = useState([]);
  const { data, loading } = useSelector((state) => state?.users);
  const { data: allCategories } = useSelector((state) => state?.categories);
  const { data: allProducts } = useSelector((state) => state?.products);
  const { addLoading: addOrderLoading , sendVerificationCodeLoading , verifyCodeLoading } = useSelector((state) => state?.orders);
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
    dispatch(fetchCategories({ page: 1, per_page: 100000 }));
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
    dispatch(fetchProducts({ page: 1, per_page: 200000000000000 }));
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
    if (!createOrderData?.name) {
      toast.warn("اختر مستخدم أولا!");
      return;
    }
    if (!createOrderData?.product) {
      toast.warn("اختر منتج أولا");
      return;
    }
    const data_send = {
      product_id: +createOrderData?.product,
      user_id: +createOrderData?.name,
    };

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
        إنشاء طلب
      </h4>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="input-group">
          <label>{t("chooseUserText")}</label>
          <select
            onChange={(e) =>
              setCreateOrderData({ ...createOrderData, name: e.target.value })
            }
          >
            <option value="">{t("selectUser")}</option>
            {userData?.map((item) => (
              <option value={item?.user_id}>{item?.username}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>{t("chooseCategory")}</label>
          <select
            onChange={(e) =>
              setCreateOrderData({
                ...createOrderData,
                category: e.target.value,
              })
            }
          >
            <option value="">{t("selectCategory")}</option>

            {allCategories?.data?.categories?.map((item) => (
              <option value={item?.category_id}>{item?.title}</option>
            ))}
          </select>
        </div>
      </div>
      {specificProducts?.length ? (
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
      ) : null}

      <button
        onClick={handleAddToCart}
        className="bg-[#0d6efd] my-4 text-white p-2 rounded-md"
      >
        {t("addText")}
      </button>

      <Table
        scroll={{ x: "max-content" }}
        dataSource={cartData?.data?.length ? cartData?.data : []}
        loading={cartLoading}
        columns={columns}
      />

      {cartData?.data?.length > 0 && (
        <div className="input-group space-y-4">
          <label className="block text-lg font-medium text-gray-700">
            {t("paymentMethodText")}
          </label>

          {/* Payment Method Dropdown */}
          <select
            value={selectedPaymentMethod?.type}
            onChange={(e) =>
              setSelectedPaymentMethod({
                ...selectedPaymentMethod,
                type: e.target.value,
                user_id: createOrderData?.name,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option disabled selected value="">
              Choose Payment Method
            </option>
            {PAYMENT_METHOD.map((item) => (
              <option key={item?.value} value={item?.value}>
                {item?.payment_title}
              </option>
            ))}
          </select>

          {selectedPaymentMethod?.type && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-md font-semibold text-gray-600 mb-2">
                {t("selectPaymentType")}
              </p>
              <div className="flex flex-col gap-2">
                {PAYMENT_METHOD.find(
                  (item) => item?.value === selectedPaymentMethod?.type
                )?.types?.map((type, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between whitespace-nowrap space-x-3 p-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-all"
                  >
                    <input
                      checked={selectedPaymentMethod?.method === type}
                      onChange={(e) =>
                        setSelectedPaymentMethod((prev) => ({
                          ...prev,
                          method: e.target.value,
                          user_id: createOrderData?.name,
                        }))
                      }
                      type="radio"
                      value={type}
                      name="payment_method"
                      className="form-radio 
                  !w-fit !h-[20px] focus:outline-none focus:!shadow-none  text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedPaymentMethod?.method == "mini money" && (
            <InstallmentSelect
              cartData={cartData}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
          )}

          {cartData?.data?.length && (
            <button
            onClick={
              selectedPaymentMethod?.method === "wallet" && !isVerified
                ? handleOrder
                : createOrder
            }
            className="bg-blue-500 text-white p-3 rounded-md"
          >
            {sendVerificationCodeLoading || addLoading
              ? t("loadingText")
              : selectedPaymentMethod?.method === "wallet" && !isVerified
              ? t("sendVerifyText")
              : t("createOrderText")}
          </button>
          
            // <button
            //   onClick={(isVerified ||  !selectedPaymentMethod?.method == "wallet")  ? createOrder : handleOrder}
            //   className="bg-blue-500 text-white p-3 rounded-md"
            // >
            //   {sendVerificationCodeLoading || addLoading   ? t("loadingText") :( isVerified  || selectedPaymentMethod?.method != "Cash" )  ? t("createOrderText"):t("sendVerifyText")}
            // </button>
          )}
        </div>
      )}

      <Modal
        title={t("VerificationCode")}
        open={otpModal}
        onCancel={() => setOtpModal(false)}
        onClose={() => setOtpModal(false)}
        footer={null}
      >
        <div className="my-5">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            containerStyle="!grid grid-cols-4 gap-4 w-full"
            renderInput={(props) => (
              <input
                {...props}
                style={{ direction: "ltr !important" }}
                className="!w-[50px] mx-auto !h-[50px]  text-xl text-center border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-all"
              />
            )}
          />
        </div>

        <button
          onClick={handleVerificationCode}
          className="bg-blue-500 text-white p-2 rounded-md my-4 w-full"
        >
          {verifyCodeLoading ? t("loadingText") : t("addText")}
        </button>
      </Modal>
    </div>
  );
}
