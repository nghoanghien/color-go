'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaBus, FaHeart, FaTicketAlt, FaTag, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PendingOverlay from '@/components/pending-overlay';

const BottomNavigation = ({ activeTab, setActiveTab, setIsLoading }) => {
  const router = useRouter();

  const handleNavigation = (tab) => {
    // Nếu click vào tab hiện tại thì không làm gì cả
    if (tab === activeTab) {
      return;
    }
    
    setActiveTab(tab);
    setIsLoading(true); // Set loading state before navigation
    
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
    <motion.div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-green-100 px-6 py-4 shadow-lg z-50">
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
  const pathname = usePathname();
  const currentTab = pathname?.split('/').at(-1) || 'booking';
  const [activeTab, setActiveTab] = useState(currentTab);
  const [isLoading, setIsLoading] = useState(false);

  // Listen for route changes to update loading state
  React.useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <div>
      {children}
      <PendingOverlay isLoading={isLoading} />
      <BottomNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}