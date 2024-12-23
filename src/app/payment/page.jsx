"use client";

import LoadingOverlay from "@/components/loading-overlay";
import PendingOverlay from "@/components/pending-overlay";
import { useUserInfomation } from "@/firebase/authenticate";
import { useRouteDetail } from "@/hooks/useRouteDetail";
import { changeMembershipById } from "@/services/membership";
import { getPromotionList } from "@/services/promotion";
import { createTicket, isValidTicket } from "@/services/ticket";
import { addUsedPromotion, getUserById } from "@/services/user";
import { adjustUserBalance } from "@/services/wallet";
import { generateRandomId } from "@/utils/getRandom";
import { formatCurrencyVN } from "@/utils/money-manipulation";
import { formatDate } from "@/utils/time-manipulation";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaExclamationCircle,
  FaLock,
  FaTag,
  FaTicketAlt,
  FaTimes,
} from "react-icons/fa";

const PaymentConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showInvalidBalance, setShowInvalidBalance] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [_, user] = useUserInfomation();

  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      const data = await getUserById(user.uid);
      setUserInfo(data);
    })();
  }, [user]);

  useEffect(() => {
    if (!userInfo) return;
    (async () => {
      const data = await getPromotionList();
      const availableCoupons = data.filter((coupon) =>
        isValidTicket(coupon.valid)
      );
      const remainingCoupons = availableCoupons.filter(
        (coupon) => !userInfo.usedPromotions.includes(coupon.code)
      );
      setAvailableCoupons(remainingCoupons);
    })();
  }, [userInfo]);

  const paymentMethods = [
    {
      id: "color-pay",
      name: "Ví ColorPay",
      logo: "/images/colorPay.jpg",
    },
    // {
    //   id: "momo",
    //   name: "Ví MoMo",
    //   logo: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7",
    // },
    // {
    //   id: "zalopay",
    //   name: "ZaloPay",
    //   logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41",
    // },
    // {
    //   id: "vnpay",
    //   name: "VNPay",
    //   logo: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff",
    // },
  ];

  const [isLoading, route] = useRouteDetail(searchParams.get("id"));

  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    (async () => {
      if (!route.price) return;

      const contact = searchParams.get("contact")
        ? JSON.parse(searchParams.get("contact"))
        : {};

      let totalAmount =
        route.price * searchParams.get("seats").split(",").length;

      let grandTotal = totalAmount;

      if (selectedCoupon) {
        if (selectedCoupon.type === 1) {
          grandTotal = totalAmount * (1 - selectedCoupon.value / 100);
        } else {
          grandTotal = totalAmount - selectedCoupon.value;
        }
      }

      const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      });

      const invoiceDetails = {
        service: "Xe khách liên tỉnh",
        customerName: contact.name,
        amount: formatter.format(totalAmount),
        serviceFee: formatter.format(0),
        subtotal: formatter.format(totalAmount),
        total: formatter.format(grandTotal),
        originalPrice: grandTotal,
        totalPrice: totalAmount
      };

      setInvoiceDetails(invoiceDetails);
    })();
  }, [route, searchParams, selectedCoupon]);

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsPending(true);

    const ticketData = {
      id: generateRandomId(8),
      routeId: searchParams.get("id"),
      seats: searchParams.get("seats").split(","),
      contact: searchParams.get("contact"),
      pickup: searchParams.get("pickup"),
      dropoff: searchParams.get("dropoff"),
      price: invoiceDetails.originalPrice,
      status: 1,
    };
    try {
      await adjustUserBalance(
        user.uid,
        "Thanh toán vé",
        -parseInt(invoiceDetails.originalPrice, 10)
      );
      if (selectedCoupon) {
        await addUsedPromotion(user.uid, selectedCoupon.code);
      }
      await createTicket(user.uid, ticketData);
      await changeMembershipById(
        user.uid,
        "Đặt vé xe khách",
        Math.floor(parseInt(invoiceDetails.originalPrice, 10) / 1000)
      );
      router.push("/payment-success?" + searchParams.toString());
    } catch (error) {
      setIsPending(false);
      if (error.message === "Invalid balance") {
        setShowInvalidBalance(true);
        setTimeout(() => setShowInvalidBalance(false), 3000);
      }
    }
  };

  const handleApplyCoupon = () => {
    setShowCouponModal(false);
  };

  return !invoiceDetails || !userInfo ? (
    <LoadingOverlay isLoading />
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-32">
      <PendingOverlay isLoading={isPending} />
      <div className="bg-transparent p-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300">
            <FaArrowLeft
              className="text-gray-600 text-xl"
              onClick={() => {
                setIsPending(true);
                router.back();
              }}
            />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            Xác nhận thanh toán
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-6 mt-4 mb-40">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Phương thức thanh toán
          </h2>
          <div className="overflow-x-auto relative">
            <div
              className="flex gap-4 pb-4 snap-x snap-mandatory touch-pan-x overflow-x-auto scrollbar-none"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {paymentMethods.map((method) => (
                <div
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex-shrink-0 snap-start flex items-center gap-4 p-4 rounded-xl cursor-pointer min-w-[200px] transform transition-all duration-300 hover:shadow-lg ${
                  selectedPayment === method.id
                    ? "border border-blue-500 bg-blue-50"
                    : "border border-gray-200 bg-white"
                }`}
              >
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {method.name}
                    </span>
                    <div className="text-sm text-gray-500">
                      {formatCurrencyVN(userInfo.wallet.balance)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800">
          Chi tiết hóa đơn
        </h2>
        <div className="bg-white rounded-2xl p-6 space-y-4 font-medium">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Dịch vụ</span>
              <span>{invoiceDetails.service}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tên khách hàng</span>
              <span>{invoiceDetails.customerName}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Số tiền thanh toán</span>
              <span>{invoiceDetails.amount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí dịch vụ</span>
              <span>{invoiceDetails.serviceFee}</span>
            </div>
            <div className="flex justify-between text-gray-600 pt-2 border-t">
              <span>Tạm tính</span>
              <span>{invoiceDetails.subtotal}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100">
        <div className="max-w-2xl mx-auto py-2 px-4 space-y-2">
          <button
            onClick={() => setShowCouponModal(true)}
            className="w-full py-2 px-4 bg-gray-50 rounded-xl text-left text-gray-600 hover:bg-gray-100 transition-colors duration-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FaTicketAlt className="text-gray-500" />
              <span className="font-semibold">Ưu đãi</span>
            </div>
            <span className="text-sm text-gray-500 font-bold">
              {selectedCoupon ? selectedCoupon.code : "Chọn hoặc nhập mã"}
            </span>
          </button>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">Tổng tiền</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through">
                {invoiceDetails.totalPrice !== invoiceDetails.originalPrice
                  ? formatCurrencyVN(invoiceDetails.totalPrice)
                  : ""}
              </span>
              <span className="text-xl font-bold text-blue-600">
                {invoiceDetails.total}
              </span>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 font-medium flex items-center justify-center gap-2"
          >
            <FaLock />
            Xác nhận thanh toán
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showInvalidBalance && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <FaExclamationCircle />
              <span>Số dư tài khoản không đủ để thanh toán</span>
            </div>
          </motion.div>
        )}

        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <FaExclamationCircle />
              <span>Vui lòng chọn phương thức thanh toán</span>
            </div>
          </motion.div>
        )}

        {showCouponModal && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 m-4 w-full max-w-md shadow-xl border border-white/20 relative max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                  Ưu đãi
                </h3>
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              <div className="flex flex-col h-full">
                <div
                  className="flex-grow overflow-y-auto hide-scrollbar space-y-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {availableCoupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      onClick={() => setSelectedCoupon(coupon)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedCoupon?.id === coupon.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FaTag className="text-blue-500" />
                          <span className="font-bold text-blue-600">
                            {coupon.code}
                          </span>
                        </div>
                        <span className="text-green-600 font-bold">
                          {coupon.type
                            ? `${coupon.value}%`
                            : new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(coupon.value)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{coupon.title}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Hết hạn: {formatDate(coupon.valid)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="relative mt-4">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Nhập mã ưu đãi khác"
                      className="w-full p-4 border border-gray-200 rounded-xl pr-24"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="absolute right-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-300"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default () => {
  return (
    <Suspense fallback={<LoadingOverlay isLoading />}>
      <PaymentConfirmationPage />
    </Suspense>
  );
};
