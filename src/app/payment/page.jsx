'use client';

import React, { useState } from "react";
import { FaArrowLeft, FaTimes, FaLock, FaExclamationCircle, FaTicketAlt, FaTag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const PaymentConfirmationPage = () => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const availableCoupons = [
    {
      id: 1,
      code: "SUMMER2023",
      discount: "20%",
      description: "Giảm 20% cho mọi chuyến đi",
      expiry: "30/12/2023"
    },
    {
      id: 2,
      code: "NEWUSER",
      discount: "50K",
      description: "Giảm 50.000đ cho người dùng mới",
      expiry: "31/12/2023"
    },
    {
      id: 3,
      code: "WEEKEND",
      discount: "15%",
      description: "Giảm 15% cho chuyến đi cuối tuần",
      expiry: "25/12/2023"
    }
  ];

  const paymentMethods = [
    {
      id: "bank",
      name: "Chuyển khoản ngân hàng",
      logo: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d"
    },
    {
      id: "momo",
      name: "Ví MoMo",
      logo: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7"
    },
    {
      id: "zalopay",
      name: "ZaloPay",
      logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41"
    },
    {
      id: "vnpay",
      name: "VNPay",
      logo: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff"
    }
  ];

  const invoiceDetails = {
    service: "Xe khách liên tỉnh",
    customerName: "Nguyễn Văn A",
    amount: "750.000",
    serviceFee: "15.000",
    subtotal: "765.000",
    total: "765.000"
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  };

  const handlePayment = () => {
    if (!selectedPayment) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    // Handle payment logic
  };

  const handleApplyCoupon = () => {
    setShowCouponModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-32">
      <div className="bg-transparent p-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300">
            <FaArrowLeft className="text-gray-600 text-xl" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Xác nhận thanh toán</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-6 mt-4 mb-40">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Phương thức thanh toán</h2>
          <div className="overflow-x-auto relative">
            <div className="flex gap-4 pb-4 snap-x snap-mandatory touch-pan-x overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`flex-shrink-0 snap-start flex items-center gap-4 p-4 bg-white rounded-xl cursor-pointer min-w-[200px] transform transition-all duration-300 hover:shadow-lg ${selectedPayment === method.id ? "border-2 border-blue-500 scale-[1.02]" : "border border-gray-200"}`}
                >
                  <img src={method.logo} alt={method.name} className="w-10 h-10 object-cover rounded-lg" />
                  <span className="font-medium text-gray-800">{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800">Chi tiết hóa đơn</h2>
        <div className="bg-white rounded-2xl p-6 space-y-4">
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
              <span>{invoiceDetails.amount}đ</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí dịch vụ</span>
              <span>{invoiceDetails.serviceFee}đ</span>
            </div>
            <div className="flex justify-between text-gray-600 pt-2 border-t">
              <span>Tạm tính</span>
              <span>{invoiceDetails.subtotal}đ</span>
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
            <span className="text-xl font-bold text-blue-600">{invoiceDetails.total}đ</span>
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
                <div className="flex-grow overflow-y-auto hide-scrollbar space-y-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {availableCoupons.map((coupon) => (
                    <div 
                      key={coupon.id}
                      onClick={() => setSelectedCoupon(coupon)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${selectedCoupon?.id === coupon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FaTag className="text-blue-500" />
                          <span className="font-bold text-blue-600">{coupon.code}</span>
                        </div>
                        <span className="text-green-600 font-bold">{coupon.discount}</span>
                      </div>
                      <p className="text-sm text-gray-600">{coupon.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Hết hạn: {coupon.expiry}</p>
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

export default PaymentConfirmationPage;