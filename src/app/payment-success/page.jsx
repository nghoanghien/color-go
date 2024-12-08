'use client';

import React from "react";
import { FaArrowLeft, FaBus } from "react-icons/fa";
import { motion } from "framer-motion";

const PaymentSuccessPage = () => {
  const tripData = {
    busCompany: "Hoàng Long",
    selectedSeats: ["A01", "A02", "A03"],
    departure: {
      time: "08:00",
      date: "15/03/2024",
      location: "Bến xe Mỹ Đình - Hà Nội",
      pickupPoint: "Điểm đón: Cổng bến xe Mỹ Đình"
    },
    arrival: {
      time: "12:00",
      date: "15/03/2024",
      location: "Bến xe Niệm Nghĩa - Hải Phòng",
      dropoffPoint: "Điểm trả: Cổng bến xe Niệm Nghĩa"
    },
    duration: "4 giờ",
    price: "750.000"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-32">
      <div className="bg-transparent p-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300">
            <FaArrowLeft className="text-gray-600 text-xl" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Về trang chủ</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-8 mt-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)] border-2 border-green-400/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white text-4xl"
          >
            ✓
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-800">Thanh toán thành công</h2>
          <p className="text-lg text-gray-600">
            Chúc cho hành trình của bạn sẽ thật nhiều{" "}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text font-bold">
              sắc màu
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-start">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                  {tripData.busCompany}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Số ghế:</span>
                <div className="flex flex-wrap gap-2">
                  {tripData.selectedSeats.map((seat) => (
                    <span key={seat} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium shadow-sm">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-2 text-left">
                <div className="text-2xl font-bold text-gray-800">{tripData.departure.time}</div>
                <div className="text-sm font-medium text-blue-600">{tripData.departure.date}</div>
                <div className="text-base font-medium text-gray-800">{tripData.departure.location}</div>
                <div className="text-sm text-gray-600">{tripData.departure.pickupPoint}</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="text-base font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full shadow-sm">
                  {tripData.duration}
                </div>
                <div className="w-12 border-t-2 border-dashed border-blue-300 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white p-1 rounded-full shadow-md">
                    <FaBus className="text-blue-500 text-lg" />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-right">
                <div className="text-2xl font-bold text-gray-800">{tripData.arrival.time}</div>
                <div className="text-sm font-medium text-blue-600">{tripData.arrival.date}</div>
                <div className="text-base font-medium text-gray-800">{tripData.arrival.location}</div>
                <div className="text-sm text-gray-600">{tripData.arrival.dropoffPoint}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-4"
        >
          <img 
            src="/images/Logo-new.png" 
            alt="Website Logo" 
            className="h-12 mx-auto object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;