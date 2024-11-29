'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBus, FaHeart, FaTicketAlt, FaTag, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const router = useRouter();

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "booking":
        router.push("/booking");
        break;
      case "favourite":
        router.push("/favourite");
        break;
      case "ticket":
        router.push("/my-tickets");
        break;
      case "discount":
        router.push("/discount");
        break;
      case "account":
        router.push("/account");
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-green-100 px-6 py-4 shadow-lg z-50"
    >
      <div className="flex justify-between items-center max-w-lg mx-auto">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleNavigation("booking")}
          className={`flex flex-col items-center ${activeTab === "booking" ? "text-blue-500" : "text-gray-400"}`}
        >
          <FaBus className="text-2xl mb-1" />
          <span className="text-xs font-medium">Đặt vé</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleNavigation("favourite")}
          className={`flex flex-col items-center ${activeTab === "favourite" ? "text-blue-500" : "text-gray-400"}`}
        >
          <FaHeart className="text-2xl mb-1" />
          <span className="text-xs font-medium">Yêu thích</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleNavigation("ticket")}
          className={`flex flex-col items-center ${activeTab === "ticket" ? "text-blue-500" : "text-gray-400"}`}
        >
          <FaTicketAlt className="text-2xl mb-1" />
          <span className="text-xs font-medium">Vé của tôi</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleNavigation("discount")}
          className={`flex flex-col items-center ${activeTab === "discount" ? "text-blue-500" : "text-gray-400"}`}
        >
          <FaTag className="text-2xl mb-1" />
          <span className="text-xs font-medium">Ưu đãi</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleNavigation("account")}
          className={`flex flex-col items-center ${activeTab === "account" ? "text-blue-500" : "text-gray-400"}`}
        >
          <FaUser className="text-2xl mb-1" />
          <span className="text-xs font-medium">Tài khoản</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function Layout({ children }) {
  const currentTab = location.pathname.split('/').at(-1);
  const [activeTab, setActiveTab] = useState(currentTab); // Default active tab

  return (
    <div>
      {children}
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}