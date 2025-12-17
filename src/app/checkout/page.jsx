"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button, Card, Modal, Radio, Select, Spin, Tag, Steps, Input } from "antd";

import GetCartData from "@/CartAction/GetCartData";
import DeletePtoductitem from "@/CartAction/DeleteProduct";
import AddAddressModal from "../components/AddAddressModal";
import EditAddressModal from "../components/EditAddressModal";
import useGetDeliveryAreas from "../../../hooks/useGerDeliveryAreas";

import { toast } from "sonner";
import {
  SquarePen,
  Trash,
  MapPin,
  CreditCard,
  Wallet,
  ShoppingBag,
  User,
  Phone,
  Truck,
  Percent,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import useAddresses from "../../../hooks/useGetAddresses";
import { useDispatch } from "react-redux";
import { getCartThunk } from "../../store/cartSlice";
import EmptyCheckout from "../_commponent/EmptyCheckout";
import cx from "../../lib/cx";

// ✅ NEW: promo check hook
import useCheckPromoCode from "../../../hooks/useCheckPromoCode";

const formatPrice = (value) =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP" }).format(
    value
  );

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
    fetchAddresses,
    deleteAddress: deleteAddressAPI,
    updateAddress,
    addAddress: addAddressAPI,
  } = useAddresses(session?.user?.accessToken);

  const [selectedAddressEdit, setSelectedAddressEdit] = useState(null);

  const { areas: deliveryAreasRes, fetchDliveryAreas } = useGetDeliveryAreas();

  const handleTogglePrimary = async (address) => {
    const currentlyPrimary = Number(address.is_primary) === 1;
    const newPrimaryValue = !currentlyPrimary;
    try {
      await updateAddress({
        id: address.id,
        is_primary: newPrimaryValue,
      });
    } finally {
    }
  };

  const deliveryAreasList = useMemo(() => {
    return (
      deliveryAreasRes?.deliveryAreas ||
      deliveryAreasRes?.data?.deliveryAreas ||
      deliveryAreasRes?.delivery_areas ||
      deliveryAreasRes ||
      []
    );
  }, [deliveryAreasRes]);

  const [cart, setCart] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [subPayment, setSubPayment] = useState("");

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressType, setAddressType] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedInstallment, setSelectedInstallment] = useState({});

  const [loading, setLoading] = useState(false);

  // ✅ Promocode States (UI only)
  const [promocodeInput, setPromocodeInput] = useState("");

  // ✅ NEW: hook state
  const {
    checkPromo,
    data: promoCheckResponse,
    loading: promocodeLoading,
    error: promocodeError,
    reset: resetPromoHook,
  } = useCheckPromoCode();

  // ✅ applied promo object (from API)
  const [appliedPromocode, setAppliedPromocode] = useState(null);

  const items = cart?.data || [];

  const currentStep = useMemo(() => {
    if (!items?.length) return 0;
    if (!selectedAddress) return 1;
    if (!paymentMethod || !subPayment) return 2;
    return 3;
  }, [items?.length, selectedAddress, paymentMethod, subPayment]);

  const selectedAddressObj = useMemo(() => {
    if (!selectedAddress) return null;
    return (
      addresses?.find((a) => Number(a.id) === Number(selectedAddress)) || null
    );
  }, [addresses, selectedAddress]);

  const shippingPrice = useMemo(() => {
    const p = selectedAddressObj?.region?.region_price;
    if (p != null) return Number(p);

    const area = deliveryAreasList?.find(
      (x) =>
        Number(x.region_id ?? x.id) === Number(selectedAddressObj?.region_id)
    );

    return Number(area?.region_price ?? 0);
  }, [selectedAddressObj, deliveryAreasList]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.sell_price * item.quantity,
        0
      ),
    [items]
  );

  const totalWithInstallments = useMemo(() => {
    return items.reduce((sum, item) => {
      if (paymentMethod === "miniMoney" && selectedInstallment[item.product_id]) {
        const selectedInst = item.installments?.find(
          (inst) => inst.installment_id === selectedInstallment[item.product_id]
        );

        if (selectedInst) {
          return sum + selectedInst.full_price * item.quantity;
        }
      }

      const unitPrice = item.offer?.sell_value ?? item.sell_price;
      return sum + unitPrice * item.quantity;
    }, 0);
  }, [items, selectedInstallment, paymentMethod]);

  const totalDiscount = useMemo(
    () => subtotal - totalWithInstallments,
    [subtotal, totalWithInstallments]
  );

  // ✅ IMPORTANT:
  // order_total اللي هنبعته للـ promo API (بدون شحن)
  const orderTotalForPromo = useMemo(() => {
    return Number(totalWithInstallments || 0);
  }, [totalWithInstallments]);

  // ✅ Use API results as source of truth (discount + final_total)
  const promocodeDiscount = useMemo(() => {
    const d = promoCheckResponse?.data?.discount;
    return d ? Number(d) : 0;
  }, [promoCheckResponse]);

  const totalAfterPromocode = useMemo(() => {
    const apiFinal = promoCheckResponse?.data?.final_total;
    if (apiFinal == null) return orderTotalForPromo;
    return Number(apiFinal);
  }, [promoCheckResponse, orderTotalForPromo]);

  const totalDue = useMemo(() => {
    const ship = selectedAddress ? Number(shippingPrice || 0) : 0;
    return Math.max(0, totalAfterPromocode + ship);
  }, [totalAfterPromocode, shippingPrice, selectedAddress]);

  // ✅ apply promo via hook (NEW)
  const handleApplyPromocode = async () => {
    const code = promocodeInput.trim().toUpperCase();
    if (!code) {
      toast.error("الرجاء إدخال كود الخصم");
      return;
    }

    // لو سلة فاضية أو الإجمالي صفر
    if (!items?.length || orderTotalForPromo <= 0) {
      toast.error("لا يمكن تطبيق كود الخصم على سلة فارغة");
      return;
    }

    const res = await checkPromo({
      code,
      orderTotal: orderTotalForPromo,
    });

    if (res?.success && res?.data?.valid) {
      // promo object from API: res.data.promo
      setAppliedPromocode(res.data.promo || { code });
      toast.success(res?.message || "تم تطبيق كود الخصم بنجاح! 🎉");
    } else {
      setAppliedPromocode(null);
      toast.error(res?.message || "كود خصم غير صالح");
    }
  };

  const handleRemovePromocode = () => {
    setAppliedPromocode(null);
    setPromocodeInput("");
    resetPromoHook();
    toast.info("تم إزالة كود الخصم");
  };

  // ✅ لو الإجمالي اتغير (كمية/تقسيط/منتجات) لازم نعيد فحص الكود تلقائيًا (اختياري)
  // هنا هنمسح الكود لتجنب أرقام غلط
  useEffect(() => {
    if (!appliedPromocode) return;
    // أي تغيير في الإجمالي → الأفضل إعادة الفحص أو إلغاء التطبيق
    // هنا هنلغي التطبيق تلقائيًا (أكثر أمانًا)
    handleRemovePromocode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderTotalForPromo, paymentMethod, selectedInstallment, items.length]);

  useEffect(() => {
    if (session) fetchAddresses();
  }, [session, fetchAddresses]);

  useEffect(() => {
    fetchDliveryAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (addresses?.length && !selectedAddress) {
      const primaryAddress = addresses.find((a) => Number(a.is_primary) === 1);
      if (primaryAddress) setSelectedAddress(primaryAddress.id);
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    (async () => {
      const data = await GetCartData();
      setCart(data?.success ? data : { data: [] });
    })();
  }, []);

  useEffect(() => {
    if (cart && items.length === 0) {
      router.replace("/cart");
    }
  }, [cart, items.length, router]);

  const handleSelectInstallment = (productId, installmentId) => {
    setSelectedInstallment((prev) => ({
      ...prev,
      [productId]: installmentId,
    }));

    toast.success("تم تحديث خطة التقسيط وإعادة حساب المبلغ");
  };

  async function deleteProduct(product_id) {
    const data = await DeletePtoductitem(product_id);
    if (data?.success) {
      const updatedCart = await GetCartData();
      setCart(updatedCart);
      dispatch(getCartThunk({ token: session?.user?.accessToken }));
    }
  }

  const handleAddAddress = async () => {
    const isFirstAddress = !addresses || addresses.length === 0;

    await addAddressAPI({
      alias: addressType,
      details: newAddress,
      longitude,
      latitude,
      region_id: governorate,
      is_primary: isFirstAddress ? 1 : 0,
    });

    setIsModalOpen(false);
    setAddressType("");
    setGovernorate("");
    setNewAddress("");
    setLatitude(null);
    setLongitude(null);

    await fetchAddresses();
  };

  const handleDeleteAddress = async (id) => {
    await deleteAddressAPI(id);
    await fetchAddresses();
  };

  const createOrder = async (
    payment_type,
    payment_method,
    installments = []
  ) => {
    try {
      setLoading(true);

      const response = await fetch("https://lesarjet.camp-coding.site/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          payment_type,
          payment_method,
          name: session?.user?.name,
          phone: session?.user?.phone,
          installments,
          promo_code: appliedPromocode?.code || null,
        }),
      });

      const json = await response.json();

      if (!json?.success) {
        throw new Error(json?.message || "حدث خطأ");
      }

      toast.success("تم انشاء الطلب بنجاح");
      dispatch(getCartThunk({ token: session.user.accessToken }));
      router.replace("/orders");

      if (payment_method === "credit") {
        const paymentUrl = json?.data?.message?.data?.url;
        if (paymentUrl && typeof window !== "undefined") {
          window.open(paymentUrl, "_blank");
        }
      }

      setCart({ data: [] });
      setPaymentMethod("");
      setSubPayment("");
      setSelectedAddress(null);
      setSelectedInstallment({});
      setAppliedPromocode(null);
      setPromocodeInput("");
      resetPromoHook();
    } catch (error) {
      toast.error(error?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!session) return;

    if (!selectedAddress) {
      toast.error("من فضلك اختر عنوان التوصيل");
      return;
    }

    if (!paymentMethod) {
      toast.error("من فضلك اختر طريقة الدفع");
      return;
    }

    if (!subPayment) {
      toast.error("من فضلك اختر خيار الدفع");
      return;
    }

    if (paymentMethod === "cash" && subPayment === "عند الاستلام") {
      return createOrder("cash", "cash on delivery");
    }

    if (paymentMethod === "cash" && subPayment === "بطاقة ائتمان") {
      return createOrder("cash", "credit");
    }

    if (paymentMethod === "wallet" && subPayment === "محفظتك") {
      return createOrder("wallet", "wallet");
    }

    if (paymentMethod === "miniMoney" && subPayment === "ميني موني") {
      if (Object.keys(selectedInstallment).length !== items.length) {
        toast.error("من فضلك اختر قسط لكل منتج");
        return;
      }

      const installmentsPayload = Object.entries(selectedInstallment).map(
        ([productId, installmentId]) => ({
          installment_id: installmentId,
          product_id: Number(productId),
        })
      );

      return createOrder("installment", "mini money", installmentsPayload);
    }

    toast.error("اختيار الدفع غير صحيح");
  };

  if (status === "loading" || !cart) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-slate-50 to-slate-100">
        <header className="bg-white/80 backdrop-blur border-b border-slate-100 shadow-sm sticky top-0 z-30">
          <div className="container mx-auto px-4 py-5 md:py-6 flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="hidden md:block space-y-2">
              <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <section className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-44 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                </div>

                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-100 bg-white p-5"
                    >
                      <div className="h-32 w-32 rounded-xl bg-slate-100 animate-pulse mx-auto sm:mx-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
                        <div className="flex justify-between">
                          <div className="h-9 w-28 bg-slate-100 rounded-full animate-pulse" />
                          <div className="h-9 w-28 bg-slate-200 rounded-full animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="h-5 w-36 bg-slate-200 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-14 w-full bg-slate-100 rounded-xl animate-pulse" />
                  <div className="h-14 w-full bg-slate-200 rounded-xl animate-pulse" />
                  <div className="h-11 w-full bg-slate-200 rounded-full animate-pulse mt-3" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-4" />
                <div className="h-11 w-full bg-slate-100 rounded-xl animate-pulse" />
                <div className="mt-4 space-y-3">
                  <div className="h-16 w-full bg-slate-100 rounded-xl animate-pulse" />
                  <div className="h-16 w-full bg-slate-200 rounded-xl animate-pulse" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-5" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-slate-100 rounded animate-pulse" />
                  <div className="h-12 w-full bg-slate-200 rounded-full animate-pulse mt-4" />
                </div>
              </div>
            </aside>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            جاري تحميل بيانات إتمام الطلب...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-linear-to-b! from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mx-auto mb-5">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-slate-900">
            الرجاء تسجيل الدخول أولًا
          </h1>
          <p className="text-slate-500 mb-7 text-base">
            للوصول إلى سلة التسوق الخاصة بك وإتمام الطلبات، يجب أن تقوم بتسجيل
            الدخول إلى حسابك.
          </p>
          <Link href="/login">
            <Button
              type="primary"
              size="large"
              className="w-full rounded-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
            >
              تسجيل الدخول
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 shadow-sm z-30">
        <div className="container mx-auto px-4 py-5 md:py-6 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                إتمام الطلب
              </h1>
              <p className="text-sm md:text-base text-slate-500 mt-1">
                {items.length === 0
                  ? "سلة التسوق الخاصة بك فارغة."
                  : `لديك ${items.length} منتج في السلة.`}
              </p>

              <div className="mt-4">
                <Steps
                  current={currentStep}
                  direction="horizontal"
                  items={[
                    { title: "السلة" },
                    { title: "العنوان" },
                    { title: "الدفع" },
                    { title: "تأكيد" },
                  ]}
                  className={cx(
                    "[&_.ant-steps-item-title]:text-sm",
                    "[&_.ant-steps-item-description]:text-xs"
                  )}
                />
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end text-sm text-slate-700 gap-2">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                <span className="font-medium">{session?.user?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="font-medium">{session?.user?.phone}</span>
              </div>
            </div>
          </div>

          {items.length > 0 && (
            <div
              className={cx(
                "rounded-2xl border px-4 py-3 text-sm",
                currentStep === 1 && "bg-blue-50 border-blue-200 text-blue-700",
                currentStep === 2 &&
                  "bg-purple-50 border-purple-200 text-purple-700",
                currentStep === 3 &&
                  "bg-emerald-50 border-emerald-200 text-emerald-700"
              )}
            >
              {currentStep === 1 &&
                "اختر عنوان التوصيل أو أضف عنوان جديد لإكمال الطلب."}
              {currentStep === 2 &&
                "اختر طريقة الدفع ثم حدّد خيار الدفع لإكمال الطلب."}
              {currentStep === 3 && "كل شيء جاهز ✅ يمكنك إتمام الشراء الآن."}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className={cx("grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10")}>
          {/* Cart */}
          <section className="lg:col-span-2 space-y-6">
            <Card
              className="border border-slate-100 rounded-2xl"
              bodyStyle={{ padding: 20 }}
              title={
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-emerald-500" />
                    <span className="font-bold text-slate-800 text-lg">
                      منتجات السلة
                    </span>
                  </div>
                  {items.length > 0 && (
                    <span className="text-sm text-slate-500">
                      عدد المنتجات:{" "}
                      <span className="font-bold text-slate-800">
                        {items.length}
                      </span>
                    </span>
                  )}
                </div>
              }
            >
              <div className="space-y-5">
                {items.map((item) => {
                  const unitPrice = item.sell_price;
                  const offerPrice = item.offer?.sell_value ?? null;

                  let lineTotal;
                  let isInstallmentApplied = false;

                  if (paymentMethod === "miniMoney" && selectedInstallment[item.product_id]) {
                    const selectedInst = item.installments?.find(
                      (inst) => inst.installment_id === selectedInstallment[item.product_id]
                    );

                    if (selectedInst) {
                      lineTotal = selectedInst.full_price * item.quantity;
                      isInstallmentApplied = true;
                    } else {
                      lineTotal = (offerPrice ?? unitPrice) * item.quantity;
                    }
                  } else {
                    lineTotal = (offerPrice ?? unitPrice) * item.quantity;
                  }

                  return (
                    <div
                      key={item.product_id}
                      className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                    >
                      {(offerPrice || isInstallmentApplied) && (
                        <div className="absolute z-20 rounded-t-2xl bg-rose-500 text-white text-xs font-semibold px-12 py-1.5 shadow-md">
                          {isInstallmentApplied ? "سعر التقسيط" : "عرض خاص"}
                        </div>
                      )}

                      <div className="relative h-32 w-32 sm:h-36 sm:w-36 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 mx-auto sm:mx-0 bg-slate-50">
                        <Image
                          src={item.images}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between gap-3">
                        <div className="flex justify-between gap-3">
                          <div className="flex-1">
                            <h2 className="mb-2 text-base md:text-lg font-bold text-slate-900 line-clamp-2">
                              {item.title}
                            </h2>
                            {item.category?.title && (
                              <p className="text-sm text-slate-400">
                                {item.category.title}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => deleteProduct(item.product_id)}
                            className="self-start w-10 h-10 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all"
                            title="إزالة المنتج"
                          >
                            <Trash size={18} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-3">
                          <div className="space-y-1.5 text-sm md:text-base">
                            <div className="flex items-baseline gap-2">
                              {isInstallmentApplied ? (
                                <>
                                  <span className="text-lg md:text-xl font-bold text-purple-600">
                                    {formatPrice(lineTotal / item.quantity)}
                                  </span>
                                  <span className="text-sm md:text-base text-slate-400 line-through">
                                    {formatPrice(unitPrice)}
                                  </span>
                                </>
                              ) : (
                                <>
                                  {offerPrice && (
                                    <span className="text-lg md:text-xl font-bold text-emerald-600">
                                      {formatPrice(offerPrice)}
                                    </span>
                                  )}
                                  <span
                                    className={
                                      offerPrice
                                        ? "text-sm md:text-base text-slate-400 line-through"
                                        : "text-lg font-bold text-slate-900"
                                    }
                                  >
                                    {formatPrice(unitPrice)}
                                  </span>
                                </>
                              )}
                            </div>

                            <p className="text-sm md:text-base text-slate-500">
                              الكمية:{" "}
                              <span className="font-bold text-slate-900">
                                {item.quantity}
                              </span>
                            </p>

                            <p className="text-sm md:text-base font-bold text-slate-900">
                              إجمالي المنتج:{" "}
                              <span className={isInstallmentApplied ? "text-purple-600" : "text-emerald-600"}>
                                {formatPrice(lineTotal)}
                              </span>
                            </p>
                          </div>

                          {isInstallmentApplied && (
                            <Tag color="purple" className="text-sm py-1 px-3">
                              💳 سعر التقسيط مطبّق
                            </Tag>
                          )}

                          {!isInstallmentApplied && offerPrice && (
                            <Tag color="green" className="text-sm py-1 px-3">
                              وفر {formatPrice(unitPrice - offerPrice)} لكل قطعة
                            </Tag>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && <EmptyCheckout />}
              </div>
            </Card>
          </section>

          {/* Right column */}
          {items.length > 0 && (
            <div className="flex flex-col gap-6 lg:col-span-1 lg:top-28 self-start">
              {/* Address */}
              <Card
                className="w-full border border-slate-100 rounded-2xl shadow-md"
                bodyStyle={{ padding: 20 }}
                title={
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-blue-500" />
                      <span className="font-bold text-lg">عنوان التسليم</span>
                    </div>
                    {selectedAddress && (
                      <Tag color="blue" className="text-sm py-1 px-3">
                        تم اختيار عنوان
                      </Tag>
                    )}
                  </div>
                }
              >
                {addressesError && (
                  <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {addressesError}
                  </div>
                )}

                {addressesLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                  </div>
                ) : !addresses || addresses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <p className="text-slate-800 font-bold text-base">
                      لا توجد عناوين محفوظة
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      أضف عنوان جديد علشان تكمّل عملية الشراء.
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                      + إضافة عنوان جديد
                    </button>
                  </div>
                ) : (
                  <div>
                    <Radio.Group
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      value={selectedAddress}
                      className="w-full flex flex-col space-y-3!"
                    >
                      {addresses.map((address) => (
                        <Card
                          key={address.id}
                          size="small"
                          className={`cursor-pointer transition-all ${
                            selectedAddress === address.id
                              ? "!border-blue-600 !bg-blue-50 shadow-md"
                              : "!border-slate-200 hover:!border-blue-300 hover:shadow-md"
                          }`}
                          style={{ borderRadius: 14, borderWidth: 2 }}
                          onClick={() => {
                            setSelectedAddress(address.id);
                            handleTogglePrimary(address);
                          }}
                          bodyStyle={{ padding: 14 }}
                        >
                          <div className="flex justify-between items-start! gap-3">
                            <Radio value={address.id} className="flex-1">
                              <div className="flex flex-col gap-1.5">
                                <span className="font-bold text-base text-slate-900 flex items-center gap-2">
                                  {address.alias}
                                  {Number(address.is_primary) === 1 && (
                                    <Tag
                                      color="green"
                                      className="text-xs py-0.5 px-2"
                                    >
                                      أساسي
                                    </Tag>
                                  )}
                                </span>

                                <span className="text-slate-600 text-sm leading-relaxed">
                                  {address.details}
                                </span>

                                {!!address?.region?.region_title && (
                                  <span className="text-xs text-slate-500">
                                    المحافظة:{" "}
                                    <b className="text-slate-700">
                                      {address.region.region_title}
                                    </b>
                                    {" • "}
                                    الشحن:{" "}
                                    <b className="text-slate-700">
                                      {formatPrice(
                                        Number(address.region.region_price || 0)
                                      )}
                                    </b>
                                  </span>
                                )}
                              </div>
                            </Radio>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAddressEdit(address);
                                  setEditModalOpen(true);
                                }}
                                className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                                title="تعديل العنوان"
                              >
                                <SquarePen size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAddressToDelete(address.id);
                                  setDeleteModalOpen(true);
                                }}
                                className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                                title="حذف العنوان"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </Radio.Group>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                      + إضافة عنوان جديد
                    </button>
                  </div>
                )}

                <AddAddressModal
                  loading={addressesLoading}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  addressType={addressType}
                  setAddressType={setAddressType}
                  governorate={governorate}
                  setGovernorate={setGovernorate}
                  newAddress={newAddress}
                  setNewAddress={setNewAddress}
                  handleAddAddress={handleAddAddress}
                  latitude={latitude}
                  setLatitude={setLatitude}
                  longitude={longitude}
                  setLongitude={setLongitude}
                />

                <Modal
                  open={deleteModalOpen}
                  title={<span className="text-lg font-bold">تأكيد الحذف</span>}
                  onCancel={() => setDeleteModalOpen(false)}
                  okText="حذف"
                  cancelText="إلغاء"
                  okButtonProps={{
                    danger: true,
                    loading: addressesLoading,
                    size: "large",
                  }}
                  cancelButtonProps={{ size: "large" }}
                  onOk={() => {
                    if (addressToDelete) handleDeleteAddress(addressToDelete);
                    setDeleteModalOpen(false);
                  }}
                >
                  <p className="text-base">
                    هل أنت متأكد أنك تريد حذف هذا العنوان؟
                  </p>
                </Modal>

                <EditAddressModal
                  loading={addressesLoading}
                  isModalOpen={editModalOpen}
                  setIsModalOpen={setEditModalOpen}
                  selectedAddress={selectedAddressEdit}
                  onSave={async (updatedAddress) => {
                    await updateAddress({
                      id: updatedAddress.id,
                      alias: updatedAddress.alias,
                      details: updatedAddress.details,
                      region_id: updatedAddress.region_id,
                      latitude: updatedAddress.latitude,
                      longitude: updatedAddress.longitude,
                      is_primary: updatedAddress.is_primary ? true : false,
                    });

                    if (updatedAddress.is_primary) {
                      setSelectedAddress(updatedAddress.id);
                    }

                    await fetchAddresses();
                    setEditModalOpen(false);
                    setSelectedAddressEdit(null);
                  }}
                />
              </Card>

              {/* Payment */}
              <Card
                title={
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-purple-500" />
                    <span className="font-bold text-lg">طريقة الدفع</span>
                  </div>
                }
                className="w-full border border-slate-100 rounded-2xl shadow-md"
                bodyStyle={{ padding: 20 }}
              >
                <Select
                  value={paymentMethod || undefined}
                  onChange={(value) => {
                    if (value === "miniMoney") {
                      const productsWithoutInstallments = items
                        ?.filter(
                          (item) =>
                            !Array.isArray(item.installments) ||
                            item.installments.length === 0
                        )
                        ?.map((item) => item.product?.title || item.title);

                      if (productsWithoutInstallments.length > 0) {
                        toast.error(
                          `لا يمكن اختيار التقسيط، المنتج التالي لا يحتوي على أقساط:\n${productsWithoutInstallments.join(
                            " - "
                          )}`
                        );
                        return;
                      }
                    }
                    setPaymentMethod(value);
                    setSubPayment("");
                    setSelectedInstallment({});
                  }}
                  placeholder="اختر طريقة الدفع"
                  className="w-full"
                  size="large"
                  options={[
                    {
                      value: "wallet",
                      label: (
                        <div className="flex items-center gap-3 text-base">
                          <Wallet className="w-5 h-5 text-emerald-500" />
                          <span>المحفظة</span>
                        </div>
                      ),
                    },
                    {
                      value: "miniMoney",
                      label: (
                        <div className="flex items-center gap-3 text-base">
                          <CreditCard className="w-5 h-5 text-purple-500" />
                          <span>قسط مع ميني موني</span>
                        </div>
                      ),
                    },
                    {
                      value: "cash",
                      label: (
                        <div className="flex items-center gap-3 text-base">
                          <Truck className="w-5 h-5 text-amber-500" />
                          <span>كاش / عند الاستلام</span>
                        </div>
                      ),
                    },
                  ]}
                />

                <div className="mt-5 space-y-3 text-base text-slate-700 w-full flex flex-col">
                  {paymentMethod === "cash" && (
                    <Radio.Group
                      value={subPayment}
                      onChange={(e) => setSubPayment(e.target.value)}
                      className="w-full flex flex-col"
                    >
                      <div className="border-2 mb-4! rounded-xl p-4 w-full bg-slate-50 hover:bg-slate-100 transition">
                        <Radio
                          value="بطاقة ائتمان"
                          className="text-base font-medium"
                        >
                          بطاقة ائتمان
                        </Radio>
                        <p className="text-sm text-slate-500 mt-2 mr-6">
                          سيتم تحويلك لبوابة دفع آمنة لإتمام عملية الدفع
                          بالبطاقة.
                        </p>
                      </div>

                      <div className="border-2 rounded-xl p-4 w-full bg-slate-50 hover:bg-slate-100 transition">
                        <Radio
                          value="عند الاستلام"
                          className="text-base font-medium"
                        >
                          الدفع عند الاستلام
                        </Radio>
                        <p className="text-sm text-slate-500 mt-2 mr-6">
                          ادفع نقدًا عند استلام الطلب من مندوب التوصيل.
                        </p>
                      </div>
                    </Radio.Group>
                  )}

                  {paymentMethod === "wallet" && (
                    <Radio.Group
                      value={subPayment}
                      onChange={(e) => setSubPayment(e.target.value)}
                      className="w-full flex flex-col gap-4"
                    >
                      <div className="border-2 rounded-xl p-4 w-full bg-slate-50 hover:bg-slate-100 transition">
                        <Radio value="محفظتك" className="text-base font-medium">
                          محفظتك
                        </Radio>
                        <p className="text-sm text-slate-500 mt-2 mr-6">
                          سيتم الخصم مباشرة من رصيد المحفظة الخاص بك.
                        </p>
                      </div>
                    </Radio.Group>
                  )}

                  {paymentMethod === "miniMoney" && (
                    <>
                      <Radio.Group
                        value={subPayment}
                        onChange={(e) => setSubPayment(e.target.value)}
                        className="w-full flex flex-col gap-4"
                      >
                        <div className="border-2 rounded-xl p-4 w-full bg-slate-50 hover:bg-slate-100 transition">
                          <Radio
                            value="ميني موني"
                            className="text-base font-medium"
                          >
                            ميني موني
                          </Radio>
                          <p className="text-sm text-slate-500 mt-2 mr-6">
                            اختر خطة التقسيط المناسبة لكل منتج ثم أكمل الطلب.
                          </p>
                        </div>
                      </Radio.Group>

                      {subPayment === "ميني موني" && (
                        <div className="installments-container mt-4 p-4 space-y-6 max-h-96 overflow-y-auto bg-slate-50 rounded-xl border-2 border-slate-200">
                          {items?.map((item) => (
                            <div
                              key={item.product_id}
                              className="product-installments border-2 border-slate-200 p-4 rounded-lg shadow-sm bg-white"
                            >
                              <h3 className="text-base font-bold mb-3 text-slate-900">
                                الأقساط المتاحة لمنتج: {item.title}
                              </h3>

                              <div className="space-y-4">
                                {item.installments?.map((inst) => (
                                  <div
                                    key={inst.installment_id}
                                    className={`installment-option border-2 p-4 rounded-lg hover:bg-slate-50 transition-all ${
                                      selectedInstallment[item.product_id] === inst.installment_id
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-slate-200"
                                    }`}
                                  >
                                    <label className="flex items-center gap-3 cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`installment_${item.product_id}`}
                                        checked={
                                          selectedInstallment[
                                            item.product_id
                                          ] === inst.installment_id
                                        }
                                        onChange={() =>
                                          handleSelectInstallment(
                                            item.product_id,
                                            inst.installment_id
                                          )
                                        }
                                        className="h-5 w-5"
                                      />

                                      <span className="text-sm md:text-base font-semibold text-slate-800">
                                        {inst.installment_title} شهر —{" "}
                                        <span className="text-purple-600 font-bold">
                                          {inst.full_price.toFixed(2)} ج.م
                                        </span>
                                      </span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>

              {/* ✅ Promocode Card (NOW USING HOOK) */}
              <Card
                title={
                  <div className="flex items-center gap-3">
                    <Percent className="w-6 h-6 text-orange-500" />
                    <span className="font-bold text-lg">كود الخصم</span>
                  </div>
                }
                className="w-full border border-slate-100 rounded-2xl shadow-md"
                bodyStyle={{ padding: 20 }}
              >
                {!appliedPromocode ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        size="large"
                        placeholder="أدخل كود الخصم"
                        value={promocodeInput}
                        onChange={(e) => {
                          setPromocodeInput(e.target.value.toUpperCase());
                          if (promocodeError) resetPromoHook();
                        }}
                        onPressEnter={handleApplyPromocode}
                        className="flex-1 rounded-xl"
                        disabled={promocodeLoading}
                        status={promocodeError ? "error" : ""}
                      />
                      <Button
                        size="large"
                        type="primary"
                        onClick={handleApplyPromocode}
                        loading={promocodeLoading}
                        className="rounded-xl bg-orange-500 hover:bg-orange-600 px-6"
                      >
                        تطبيق
                      </Button>
                    </div>

                    {promocodeError && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                        <XCircle className="w-4 h-4" />
                        <span>{promocodeError}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-500">
                      لديك كود خصم؟ أدخله هنا للحصول على خصم إضافي على طلبك.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        <div>
                          <p className="font-bold text-slate-900">
                            {appliedPromocode.code}
                          </p>
                          <p className="text-sm text-slate-600">
                            {promoCheckResponse?.message || "تم تطبيق كود الخصم"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleRemovePromocode}
                        className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all"
                        title="إزالة كود الخصم"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-sm text-emerald-700 font-medium">
                        🎉 تم توفير {formatPrice(promocodeDiscount)} من إجمالي طلبك!
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Summary */}
              <aside className="w-full self-start rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <h2 className="mb-5 text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </span>
                  ملخص الطلب
                </h2>

                <div className="space-y-3 text-base text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">الإجمالي قبل الخصم</span>
                    <span className="font-bold">{formatPrice(subtotal)}</span>
                  </div>

                  {paymentMethod === "miniMoney" && Object.keys(selectedInstallment).length > 0 && (
                    <div className="flex items-center justify-between text-purple-600">
                      <span className="font-medium">الإجمالي مع التقسيط</span>
                      <span className="font-bold">{formatPrice(totalWithInstallments)}</span>
                    </div>
                  )}

                  {totalDiscount > 0 && paymentMethod !== "miniMoney" && (
                    <div className="flex items-center justify-between text-emerald-600">
                      <span className="font-medium">إجمالي الخصم</span>
                      <span className="font-bold">
                        - {formatPrice(totalDiscount)}
                      </span>
                    </div>
                  )}

                  {paymentMethod === "miniMoney" && totalDiscount < 0 && (
                    <div className="flex items-center justify-between text-orange-600">
                      <span className="font-medium">رسوم التقسيط</span>
                      <span className="font-bold">+ {formatPrice(Math.abs(totalDiscount))}</span>
                    </div>
                  )}

                  {appliedPromocode && promocodeDiscount > 0 && (
                    <div className="flex items-center justify-between text-orange-600">
                      <span className="font-medium flex items-center gap-2">
                        <Percent className="w-4 h-4" />
                        خصم الكود ({appliedPromocode.code})
                      </span>
                      <span className="font-bold">
                        - {formatPrice(promocodeDiscount)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-500 text-sm">
                    <span>تكلفة الشحن</span>
                    <span className="font-bold text-slate-900">
                      {selectedAddress
                        ? formatPrice(Number(shippingPrice || 0))
                        : "اختر عنوان أولًا"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-dashed border-slate-200 pt-4 text-lg font-bold text-slate-900">
                    <span>الإجمالي المستحق</span>
                    <span className="text-emerald-600">
                      {formatPrice(totalDue)}
                    </span>
                  </div>

                  {appliedPromocode && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-xs text-orange-700">
                        🎁 تم تطبيق كود الخصم بنجاح! وفرت {formatPrice(promocodeDiscount)}
                      </p>
                    </div>
                  )}

                  {paymentMethod === "miniMoney" && subPayment === "ميني موني" && (
                    <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-xs text-purple-700">
                        💡 السعر يشمل رسوم التقسيط. ستدفع أقساط شهرية حسب الخطة المختارة.
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  disabled={loading || items.length === 0}
                  onClick={handleCreateOrder}
                  type="primary"
                  size="large"
                  className="mt-6 w-full rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-14 text-lg font-bold shadow-lg"
                >
                  {loading ? "جار معالجة الطلب..." : "إتمام الشراء الآن"}
                </Button>

                {items.length > 0 && (
                  <p className="mt-4 text-sm text-slate-500 text-center leading-relaxed">
                    بالضغط على زر{" "}
                    <span className="font-bold">إتمام الشراء</span> فأنت توافق
                    على شروط الاستخدام وسياسة الخصوصية الخاصة بمنصة LASERJET.
                  </p>
                )}
              </aside>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
