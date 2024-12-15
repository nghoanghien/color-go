'use client';

import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCrown, FaPlus, FaTicketAlt, FaHistory, FaShare, FaComments, FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserInfomation } from "@/firebase/authenticate";
import { getLevelByPoint, getMembershipById, pointsToNextLevel } from "@/services/membership";
import LoadingOverlay from "@/components/loading-overlay";

const LoyaltyPage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("points");

  const userStatus = {
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
  };

  const [isLoading, user] = useUserInfomation();
  const [membershipLevel, setMembershipLevel] = useState("bronze"); // bronze, silver, gold, diamond
  const [membership, setMembership] = useState({});

  useEffect(() => {
    if (!user) return;

    (async () => {
      const data = await getMembershipById(user.uid);
      setMembership(data);
      const level = getLevelByPoint(data.point);
      setMembershipLevel(level);
    })();
  }, [user]); 

  const getMembershipInfo = (level) => {
    switch (level) {
      case "bronze":
        return { icon: FaCrown, color: "text-amber-700", text: "Đồng" };
      case "silver":
        return { icon: FaCrown, color: "text-gray-400", text: "Bạc" };
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


  return isLoading ? (
    <LoadingOverlay isLoading />
  ) : (
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
                  <MembershipIcon className={`text-4xl mx-auto mb-2 ${membershipInfo.color}`} />
                  <h2 className={`text-2xl font-bold mb-6 text-white`}>
                    Hạng {membershipInfo.text}
                  </h2>
                  <div className="flex justify-center items-center space-x-4 text-white">
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                      <p className="text-sm">Điểm hiện tại</p>
                      <p className="text-2xl font-bold">{membership.point?.toFixed(0)}</p>
                      <div className="mt-3">
                        <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-white h-full rounded-full transition-all duration-500" 
                            style={{ width: `${(membership.point / (membership.point + pointsToNextLevel(membership.point))) * 100}%` }}
                          />
                        </div>
                        <p className="text-sm mt-1">Còn {pointsToNextLevel(membership.point?.toFixed(0))} điểm để lên hạng tiếp theo</p>
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
                {membership.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border-b border-gray-100 last:border-none"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-500">{new Date(item.datetime).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaStar className="text-yellow-400" />
                      <span className="font-bold">{item.point?.toFixed()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-2 flex justify-around z-20">
        <button
          onClick={() => setActiveTab("points")}
          className={`flex-1 py-2 rounded-lg transition-all duration-300 text-center ${activeTab === "points" ? "bg-gradient-to-r from-blue-500 to-green-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
        >
          Điểm của tôi
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 rounded-lg transition-all duration-300 text-center ${activeTab === "history" ? "bg-gradient-to-r from-blue-500 to-green-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
        >
          Lịch sử
        </button>
      </div>
    </div>
  );
};

export default LoyaltyPage;
