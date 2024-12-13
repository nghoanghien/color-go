'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronRight, FaCircle, FaCrown, FaGem, FaHeadset, FaLock, FaMedal, FaSignOutAlt, FaWallet } from "react-icons/fa";
import '../styles/typography.css';
import { signOut, useUserInfomation } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";

const AccountPage = () => {
  const router = useRouter();

  const [isLoading, user] = useUserInfomation();

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
      id: 0,
      icon: FaWallet,
      title: "Ví ColorPay",
      description: "Thanh toán dễ dàng và tiện lợi",
      onClick: () => {
        router.push("/wallet");
      }
    },
    {
      id: 1,
      icon: FaLock,
      title: "Bảo mật",
      description: "Cài đặt mật khẩu và bảo mật tài khoản",
      onClick: () => {
        router.push("/forgot-password");
      }
    },
    {
      id: 2,
      icon: FaHeadset,
      title: "Liên hệ hỗ trợ",
      description: "Hỗ trợ 24/7",
      onClick: () => {
        router.push("/contact-and-support");
      }
    },
    {
      id: 3,
      icon: FaSignOutAlt,
      title: "Đăng xuất",
      description: "Đăng xuất khỏi tài khoản",
      onClick: () => {
        signOut();
        router.push("/login");
      }
    }
  ];

  console.log({user})

  return isLoading ? '' : (
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
                src={user.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
              />
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg">
                <MembershipIcon className={`${membershipInfo.color} text-xl`} />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{user.displayName}</h1>
              <div className="flex items-center space-x-2">
                <MembershipIcon className={`${membershipInfo.color} text-sm`} />
                <span className="text-gray-600" onClick={() => {router.push("/membership")}}>Hội viên {membershipInfo.text}</span>
              </div>
              {/* <p className="text-gray-500 text-sm mt-1">{user.uid}</p> */}
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
              onClick={item.onClick}
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