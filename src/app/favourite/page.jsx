'use client';

import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaBus, FaExclamationCircle, FaMapMarkerAlt, FaHeart, FaMapMarker, FaInfoCircle, FaTicketAlt, FaTag, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const FavoriteTicketsPage = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      departureTime: "08:00",
      arrivalTime: "12:00",
      from: "Hà Nội",
      to: "Hải Phòng",
      busCompany: "Hoàng Long",
      price: "250.000",
      seatsAvailable: 15,
      route: [
        { time: "08:00", location: "Bến xe Mỹ Đình - Hà Nội" },
        { time: "09:30", location: "Trạm dừng Hưng Yên" },
        { time: "10:45", location: "Trạm dừng Hải Dương" },
        { time: "12:00", location: "Bến xe Niệm Nghĩa - Hải Phòng" }
      ]
    },
    {
      id: 2,
      departureTime: "09:30",
      arrivalTime: "13:30",
      from: "Hà Nội",
      to: "Hải Phòng",
      busCompany: "Phương Trang",
      price: "280.000",
      seatsAvailable: 8,
      route: [
        { time: "09:30", location: "Bến xe Giáp Bát - Hà Nội" },
        { time: "11:00", location: "Trạm dừng Hưng Yên" },
        { time: "12:15", location: "Trạm dừng Hải Dương" },
        { time: "13:30", location: "Bến xe Cầu Rào - Hải Phòng" }
      ]
    },
    {
      id: 3,
      departureTime: "10:45",
      arrivalTime: "14:45",
      from: "Hà Nội",
      to: "Hải Phòng",
      busCompany: "Thành Bưởi",
      price: "260.000",
      seatsAvailable: 12,
      route: [
        { time: "10:45", location: "Bến xe Nước Ngầm - Hà Nội" },
        { time: "12:15", location: "Trạm dừng Bắc Ninh" },
        { time: "13:30", location: "Trạm dừng Hải Dương" },
        { time: "14:45", location: "Bến xe Lạc Long - Hải Phòng" }
      ]
    }
  ]);

  const [favorites, setFavorites] = useState([1, 2]);
  const [notification, setNotification] = useState({ show: false, message: "", action: null });
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ticketToRemove, setTicketToRemove] = useState(null);
  const [removedTickets, setRemovedTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("favorite");

  const filteredTickets = tickets.filter(ticket => favorites.includes(ticket.id));

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    setShowRouteModal(true);
  };

  const showNotification = (message, action = null) => {
    setNotification({ show: true, message, action });
    setTimeout(() => {
      setNotification({ show: false, message: "", action: null });
    }, 5000);
  };

  const handleRemoveFromFavorites = (ticketId) => {
    setTicketToRemove(ticketId);
    setShowConfirmModal(true);
  };

  const confirmRemove = () => {
    const removedTicket = tickets.find(t => t.id === ticketToRemove);
    setRemovedTickets([...removedTickets, removedTicket]);
    setFavorites(favorites.filter(id => id !== ticketToRemove));
    setShowConfirmModal(false);
    showNotification(
      "Đã xóa khỏi danh sách yêu thích",
      () => handleUndo(ticketToRemove)
    );
  };

  const handleUndo = (ticketId) => {
    setFavorites([...favorites, ticketId]);
    setRemovedTickets(removedTickets.filter(t => t.id !== ticketId));
    showNotification("Đã khôi phục vé");
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-20">
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
          >
            <div className="w-full max-w-md px-6 py-3 bg-gradient-to-r from-blue-500/40 to-green-500/40 backdrop-blur-sm text-white shadow-lg text-center rounded-full font-bold text-base flex items-center justify-center">
              <span>{notification.message}</span>
              {notification.action && (
                <button
                  onClick={() => notification.action()}
                  className="ml-4 px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  Hoàn tác
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-transparent p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
            <div className="text-gray-600 font-semibold text-lg">
              Vé yêu thích ({filteredTickets.length})
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-4 px-4 space-y-4">
        <AnimatePresence>
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 shadow-lg relative overflow-hidden transition-all duration-500"
            >
              <button
                onClick={() => handleRemoveFromFavorites(ticket.id)}
                className="absolute top-1 right-2 z-20 p-1.5 rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                <FaHeart className="text-lg text-[#ff4757]" />
              </button>

              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex flex-col w-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-xl font-bold text-gray-800">{ticket.departureTime}</div>
                    <div className="flex-1 flex items-center justify-center relative">
                      <div className="border-t-2 border-dashed border-gray-300 w-full absolute"></div>
                      <div className="transform rotate-0 bg-white px-2 z-10">
                        <FaBus className="text-gray-500 text-xl" />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-800">{ticket.arrivalTime}</div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{ticket.from}</span>
                    <span>{ticket.to}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-blue-500">{ticket.price}đ</p>
                </div>
              </div>

              <div className="w-full border-t border-dashed border-gray-300 my-4"></div>

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{ticket.busCompany}</h2>
                  <button 
                    onClick={() => handleRouteClick(ticket.route)}
                    className="flex items-center mt-2 text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300"
                  >
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    <span className="font-semibold">Lộ trình</span>
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <div className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                    {ticket.seatsAvailable} chỗ trống
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTickets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-gray-500">Chưa có vé yêu thích nào</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 m-4 w-full max-w-md shadow-xl border border-white/20"
            >
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Xác nhận xóa</h3>
              <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa vé này khỏi danh sách yêu thích?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:opacity-90 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 p-3 bg-white/10 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/20 transition-colors shadow-lg border border-gray-200"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRouteModal && selectedRoute && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 m-4 w-full max-w-md shadow-xl border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">Lộ trình chi tiết</h3>
              
              <div className="space-y-6 relative">
                {selectedRoute.map((stop, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-24 text-sm text-gray-600 pt-1">{stop.time}</div>
                    
                    <div className="relative flex flex-col items-center -my-2">
                      <FaMapMarker className="text-blue-500 z-10 bg-white" />
                      {index < selectedRoute.length - 1 && (
                        <div className="h-full border-l-2 border-dashed border-gray-300 absolute top-4"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{stop.location}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-yellow-50 rounded-xl">
                <p className="text-sm text-yellow-700">
                  <FaExclamationCircle className="inline-block mr-2" />
                  Lưu ý: Lịch trình chỉ là dự kiến và có thể thay đổi tùy vào tình hình giao thông.
                </p>
              </div>

              <button
                onClick={() => setShowRouteModal(false)}
                className="mt-6 w-full p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 font-medium"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-green-100 px-6 py-4 shadow-lg z-50"
      >
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab("booking")}
            className={`flex flex-col items-center ${activeTab === "booking" ? "text-blue-500" : "text-gray-400"}`}
          >
            <FaBus className="text-2xl mb-1" />
            <span className="text-xs font-medium">Đặt vé</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab("favorite")}
            className={`flex flex-col items-center ${activeTab === "favorite" ? "text-blue-500" : "text-gray-400"}`}
          >
            <FaHeart className="text-2xl mb-1" />
            <span className="text-xs font-medium">Yêu thích</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab("ticket")}
            className={`flex flex-col items-center ${activeTab === "ticket" ? "text-blue-500" : "text-gray-400"}`}
          >
            <FaTicketAlt className="text-2xl mb-1" />
            <span className="text-xs font-medium">Vé của tôi</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab("promotions")}
            className={`flex flex-col items-center ${activeTab === "promotions" ? "text-blue-500" : "text-gray-400"}`}
          >
            <FaTag className="text-2xl mb-1" />
            <span className="text-xs font-medium">Ưu đãi</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab("account")}
            className={`flex flex-col items-center ${activeTab === "account" ? "text-blue-500" : "text-gray-400"}`}
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

export default FavoriteTicketsPage;