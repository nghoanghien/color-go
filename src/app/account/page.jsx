'use client';

import React, { useState } from "react";
import { FaUser, FaLock, FaHeadset, FaSignOutAlt, FaChevronRight, FaMedal, FaCrown, FaGem, FaCircle, FaTicketAlt, FaHeart, FaTag, FaBus } from "react-icons/fa";
import { motion } from "framer-motion";
import '../styles/typography.css';
import { useRouter } from 'next/navigation';

const AccountPage = () => {
  const router = useRouter();
  const [navActiveTab, setNavActiveTab] = useState("account");
  const [membershipLevel, setMembershipLevel] = useState("gold"); // bronze, silver, gold, diamond

  const getMembershipInfo = (level) => {
    switch (level) {
      case "bronze":
        return { icon: FaCircle, color: "text-amber-700", text: "Đồng" };
      case "silver":
        return { icon: FaMedal, color: "text-gray-400", text: "Bạc" };
      case "gold":
        return { icon: FaCrown, color: "text-yellow-400", text: "Vàng" };
      case "diamond":
        return { icon: FaGem, color: "text-blue-400", text: "Kim cương" };
      default:
        return { icon: FaCircle, color: "text-amber-700", text: "Đồng" };
    }
  };

  const membershipInfo = getMembershipInfo(membershipLevel);
  const MembershipIcon = membershipInfo.icon;

  const menuItems = [
    {
      id: 1,
      icon: FaLock,
      title: "Bảo mật",
      description: "Cài đặt mật khẩu và bảo mật tài khoản"
    },
    {
      id: 2,
      icon: FaHeadset,
      title: "Liên hệ hỗ trợ",
      description: "Hỗ trợ 24/7"
    },
    {
      id: 3,
      icon: FaSignOutAlt,
      title: "Đăng xuất",
      description: "Đăng xuất khỏi tài khoản"
    }
  ];

  const handleNavigation = (tab) => {
    setNavActiveTab(tab);
    switch (tab) {
      case "booking":
        router.push("/booking");
        break;
      case "favorite":
        router.push("/favourite");
        break;
      case "mytickets":
        router.push("/my-tickets");
        break;
      case "offers":
        router.push("/promotions");
        break;
      case "account":
        router.push("/account");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-yellow-50 p-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Profile Section */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src="images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
              />
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg">
                <MembershipIcon className={`${membershipInfo.color} text-xl`} />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Nguyễn Văn A</h1>
              <div className="flex items-center space-x-2">
                <MembershipIcon className={`${membershipInfo.color} text-sm`} />
                <span className="text-gray-600">Hội viên {membershipInfo.text}</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">ID: 123456789</p>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-4">
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 shadow-lg cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-green-200 to-blue-200 p-3 rounded-xl">
                    <item.icon className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Phiên bản 1.0.0
        </motion.p>
      </motion.div>

      {/* Updated Fixed Bottom Navigation */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-green-100 px-6 py-4 shadow-lg z-50"
      >
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavigation("booking")}
            className={`flex flex-col items-center ${navActiveTab === "booking" ? "text-blue-500" : "text-gray-400"}`}
          >
            <FaBus className="text-2xl mb-1" />
            <span className="text-xs font-medium">Đặt vé</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavigation("favorite")}
            className={`flex flex-col items-center ${navActiveTab === "favorite" ? "text-blue-500" : "text-gray-400"}`}
          >
            <FaHeart className="text-2xl mb-1" />
            <span className="text-xs font-medium">Yêu thích</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavigation("mytickets")}
            className={`flex flex-col items-center ${navActiveTab === "mytickets" ? "text-blue-500" : "text-gray-400"}`}
          >
            <FaTicketAlt className="text-2xl mb-1" />
            <span className="text-xs font-medium">Vé của tôi</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavigation("offers")}
            className={`flex flex-col items-center ${navActiveTab === "offers" ? "text-blue-500" : "text-gray-400"}`}
          >
            <FaTag className="text-2xl mb-1" />
            <span className="text-xs font-medium">Ưu đãi</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavigation("account")}
            className={`flex flex-col items-center ${navActiveTab === "account" ? "text-blue-500" : "text-gray-400"}`}
          >
            <FaUser className="text-2xl mb-1" />
            <span className="text-xs font-medium">Tài khoản</span>
          </motion.button>
        </div>
      </motion.div>

      <style jsx global>{`
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AccountPage;