'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBus, FaExclamationCircle, FaHeart, FaMapMarker, FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useUserInfomation } from "@/firebase/authenticate";
import { addTicketToFavorites, getFavoriteTickets, removeTicketFromFavorites } from "@/services/user";
import { getTicketsFromIds } from "@/services/ticket";
import LoadingOverlay from "@/components/loading-overlay";
import { timeString } from "@/utils/time-manipulation";

const FavoriteTicketsPage = () => {
  const router = useRouter();

  const [favorites, setFavorites] = useState();
  const [notification, setNotification] = useState({ show: false, message: "", action: null });
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ticketToRemove, setTicketToRemove] = useState(null);
  const [removedTickets, setRemovedTickets] = useState([]);

  const [tickets, setTickets] = useState([]);
  const [isLoading, user] = useUserInfomation();


  useEffect(() => {
    if (!user) return;

    (async () => {
      const data = await getFavoriteTickets(user.uid);
      setFavorites(data);
      console.log(data);
    })();
  }, [user]);

  useEffect(() => {
    if (!favorites) return;
    (async () => {
      const routesData = await getTicketsFromIds(favorites);
      console.log(routesData);
      setTickets(routesData);
    })();
  }, [favorites]);

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
    removeTicketFromFavorites(user.uid, ticketToRemove);
    setFavorites(favorites.filter(id => id !== ticketToRemove));
    setShowConfirmModal(false);
    showNotification(
      "Đã xóa khỏi danh sách yêu thích",
      () => handleUndo(structuredClone(favorites), ticketToRemove)
    );
  };

  const handleUndo = (oldFavourites, ticketId) => {
    addTicketToFavorites(user.uid, ticketId);
    setFavorites(oldFavourites);

    //setRemovedTickets(removedTickets.filter(t => t.id !== ticketId));
    showNotification("Đã khôi phục vé");
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  };

  const handleClickTicket = (id) => {
    router.push(`/choose?id=${id}`);
  }

  return (isLoading || !favorites) ? (
    <LoadingOverlay isLoading />
  ) : (
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
              Vé yêu thích ({tickets.length})
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-4 px-4 space-y-4">
        <AnimatePresence>
          {tickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white rounded-2xl p-4 shadow-lg relative overflow-hidden transition-all duration-500 ${favorites.includes(ticket.id) ? "hover:shadow-rainbow" : ""}`}
            >
              <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex flex-col w-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-xl font-bold text-gray-800">{timeString(ticket.departureTime)}</div>
                    <div className="flex-1 flex items-center justify-center relative">
                      <div className="border-t-2 border-dashed border-gray-300 w-full absolute"></div>
                      <div className="transform rotate-0 bg-white px-2 z-10">
                        <FaBus className="text-gray-500 text-xl" />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-800">{timeString(ticket.arrivalTime)}</div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{ticket.departureLocation}</span>
                    <span>{ticket.arrivalLocation}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-blue-500">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(ticket.price)}
                  </p>
                  <div className="flex justify-between items-center mt-0">
                    <button
                      onClick={() => handleClickTicket(ticket.id)}
                      className="flex items-center justify-center px-1 py-1 mr-0.5 font-bold bg-gradient-to-r from-green-300/50 to-blue-300/50 text-white text-sm rounded-lg transition-all duration-300"
                    >
                      Chọn ghế
                    </button>
                    <button
                      onClick={() => handleRemoveFromFavorites(ticket.id)}
                      className="flex items-center justify-center p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-300"
                    >
                      <FaHeart
                        className={`text-sm transition-colors duration-300 ${favorites.includes(ticket.id) ? "text-[#ff4757]" : "text-[#ccc]"}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-dashed border-gray-300 my-4"></div>

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{ticket.name}</h2>
                  <button 
                    onClick={() => handleRouteClick(ticket.stops)}
                    className="flex items-center mt-2 text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300"
                  >
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    <span className="font-semibold">Lộ trình</span>
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <div className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                    {ticket.totalSeat} chỗ trống
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {tickets.length === 0 && (
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
                    <div className="w-10 text-sm text-gray-600 pt-1">{timeString(stop.datetime)}</div>
                    
                    <div className="relative flex flex-col items-center -my-2">
                      <FaMapMarker className="text-blue-500 z-10 bg-white" />
                      {index < selectedRoute.length - 1 && (
                        <div className="h-full border-l-2 border-dashed border-gray-300 absolute top-4"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{stop.stop}</p>
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