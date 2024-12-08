'use client';

import React from "react";
import { FaArrowLeft, FaTools } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';


const UnderDevelopmentPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-32">
      <div className="bg-transparent p-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300">
            <FaArrowLeft className="text-gray-600 text-xl" onClick={() => {router.back()}} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Quay lại</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-8 mt-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          className="w-24 h-24 bg-blue-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] border-2 border-blue-400/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white text-4xl"
          >
            <FaTools />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-800">Tính năng sắp ra mắt!</h2>
          <p className="text-lg text-gray-600">
            Chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất cho bạn.
            <br />
            Hãy cùng chờ đón những{" "}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text font-bold">
              điều tuyệt vời
            </span>{" "}
            sắp tới nhé!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-8"
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

export default UnderDevelopmentPage;
