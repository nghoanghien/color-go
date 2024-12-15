'use client';

import { motion } from "framer-motion";
import { Suspense } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";

import LoadingOverlay from "@/components/loading-overlay";
import { useRouter, useSearchParams } from 'next/navigation';

const WithdrawSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl text-center"
      >
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {searchParams.get("title")}
        </h1>
        <p className="text-gray-600 mb-6">
          {searchParams.get("message")}
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Số tiền rút:</span>
            <span className="font-semibold text-gray-800">
              {formatCurrency(searchParams.get("amount"))}
              </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Phí giao dịch:</span>
            <span className="font-semibold text-gray-800">0 VND</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => router.back()}
            className="w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <FaArrowLeft className="text-sm" />
            Quay lại ví
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default () => {
  return <Suspense fallback={<LoadingOverlay isLoading />}>
    <WithdrawSuccessPage />
  </Suspense>
};