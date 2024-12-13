'use client';

import React, { useState } from "react";
import { FaArrowLeft, FaCrown, FaPlus, FaTicketAlt, FaHistory, FaShare, FaComments, FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const LoyaltyPage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("points");

  const userStatus = {
    tier: "gold", // gold, silver, bronze
    currentPoints: 750,
    newPoints: 50,
    nextTierPoints: 1000,
    tasks: [
      {
        id: 1,
        title: "Đặt vé chuyến đi Hà Nội - Sài Gòn",
        points: 50,
        icon: <FaTicketAlt />
      },
      {
        id: 2,
        title: "Chia sẻ ứng dụng với bạn bè",
        points: 20,
        icon: <FaShare />
      },
      {
        id: 3,
        title: "Đánh giá chuyến đi",
        points: 15,
        icon: <FaComments />
      }
    ],
    history: [
      {
        id: 1,
        date: "2024-01-15",
        action: "Đặt vé thành công",
        points: 50
      },
      {
        id: 2,
        date: "2024-01-10",
        action: "Chia sẻ ứng dụng",
        points: 20
      },
      {
        id: 3,
        date: "2024-01-05",
        action: "Đánh giá 5 sao",
        points: 15
      }
    ]
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "gold":
        return "text-yellow-500";
      case "silver":
        return "text-gray-400";
      case "bronze":
        return "text-amber-700";
      default:
        return "text-gray-500";
    }
  };

  const getTierName = (tier) => {
    switch (tier) {
      case "gold":
        return "Hạng Vàng";
      case "silver":
        return "Hạng Bạc";
      case "bronze":
        return "Hạng Đồng";
      default:
        return "Chưa xếp hạng";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-32">
      <div className="bg-transparent p-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300">
            <FaArrowLeft className="text-gray-600 text-xl" onClick={() => {router.back()}} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Khách hàng thân thiết</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-8 mt-8">
        <div className="flex space-x-4 bg-white rounded-lg p-2 shadow-md">
          <button
            onClick={() => setActiveTab("points")}
            className={`flex-1 py-2 rounded-lg transition-all duration-300 ${activeTab === "points" ? "bg-gradient-to-r from-blue-500 to-green-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Điểm của tôi
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 rounded-lg transition-all duration-300 ${activeTab === "history" ? "bg-gradient-to-r from-blue-500 to-green-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Lịch sử
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "points" ? (
            <motion.div
              key="points"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-t-[2.5rem] rounded-b-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-400/90 to-green-400/90 p-8 text-center relative">
                  <FaCrown className={`text-4xl mx-auto mb-2 ${getTierColor(userStatus.tier)}`} />
                  <h2 className={`text-2xl font-bold mb-6 text-white`}>
                    {getTierName(userStatus.tier)}
                  </h2>
                  <div className="flex justify-center items-center space-x-4 text-white">
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                      <p className="text-sm">Điểm hiện tại</p>
                      <p className="text-2xl font-bold">{userStatus.currentPoints}</p>
                      <div className="mt-3">
                        <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-white h-full rounded-full transition-all duration-500" 
                            style={{ width: `${(userStatus.currentPoints / userStatus.nextTierPoints) * 100}%` }}
                          />
                        </div>
                        <p className="text-sm mt-1">Còn {userStatus.nextTierPoints - userStatus.currentPoints} điểm để lên hạng tiếp theo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">Nhiệm vụ đang có</h3>
                  <div className="space-y-4">
                    {userStatus.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-500 text-xl">{task.icon}</div>
                          <span className="text-gray-700">{task.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaStar className="text-yellow-400" />
                          <span className="font-bold">{task.points}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="space-y-4">
                {userStatus.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border-b border-gray-100 last:border-none"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.action}</p>
                      <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaStar className="text-yellow-400" />
                      <span className="font-bold">+{item.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoyaltyPage;