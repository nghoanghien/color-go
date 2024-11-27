'use client';

import React, { useState, useRef, useEffect } from "react";
import { FaBus, FaGift, FaTicketAlt, FaUser, FaCalendar, FaExchangeAlt, FaHeart, FaStar, FaTag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BookingPage = () => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState("booking");
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [validationErrors, setValidationErrors] = useState({ from: false, to: false });
  
  const fromButtonRef = useRef(null);
  const toButtonRef = useRef(null);

  const locations = [
    "TP. Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Đà Lạt",
    "Nha Trang",
    "Vũng Tàu"
  ];

  const hotDestinations = [
    {
      id: 1,
      image: "images.unsplash.com/photo-1506461883276-594a12b11cf3",
      title: "Đà Lạt",
      price: "200.000đ"
    },
    {
      id: 2,
      image: "images.unsplash.com/photo-1528127269322-539801943592",
      title: "Nha Trang",
      price: "180.000đ"
    },
    {
      id: 3,
      image: "images.unsplash.com/photo-1552733407-5d5c46c3bb3b",
      title: "Vũng Tàu",
      price: "150.000đ"
    }
  ];

  const promotions = [
    {
      id: 1,
      image: "images.unsplash.com/photo-1580828343064-fde4fc206bc6",
      title: "Giảm 30%",
      description: "Cho chuyến đi đầu tiên"
    },
    {
      id: 2,
      image: "images.unsplash.com/photo-1488646953014-85cb44e25828",
      title: "Giảm 50%",
      description: "Cho nhóm trên 5 người"
    }
  ];

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
    setValidationErrors({ from: false, to: false });
  };

  const handleModalOpen = (event, isFrom) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      x: buttonRect.left,
      y: buttonRect.bottom + window.scrollY
    });
    if (isFrom) {
      setShowFromModal(true);
    } else {
      setShowToModal(true);
    }
  };

  const handleSearch = () => {
    const errors = {
      from: !fromLocation,
      to: !toLocation
    };
    setValidationErrors(errors);

    if (!errors.from && !errors.to) {
      console.log("Searching for routes...");
    }
  };

  const LocationModal = ({ isOpen, onClose, locations, onSelect, title, position }) => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              zIndex: 50
            }}
            className="bg-white p-6 rounded-2xl w-80 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
            <div className="grid gap-2 max-h-64 overflow-y-auto custom-scrollbar">
              {locations.map((location) => (
                <motion.button
                  key={location}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100 rounded-lg transition-colors"
                  onClick={() => {
                    onSelect(location);
                    onClose();
                  }}
                >
                  {location}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: (custom) => ({
      opacity: 0,
      x: custom?.x || 0,
      y: custom?.y || 20,
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-yellow-50"
    >
      <div className="p-6 pb-24">
        <motion.div
          custom={{ y: -50 }}
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl mb-8 border border-green-100"
        >
          <motion.h1 
            custom={{ x: -100 }}
            variants={itemVariants}
            className="text-3xl font-bold mb-2 text-gray-800"
          >
            Đặt vé xe khách
          </motion.h1>
          <p className="text-gray-600 mb-8 italic">"Vì cuộc sống là những chuyến đi đầy sắc màu"</p>
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
            <motion.div custom={{ x: -50 }} variants={itemVariants} className="w-full md:w-5/12 text-center">
              <label className="block text-gray-600 text-lg font-medium mb-3 text-center">Điểm đi</label>
              <button
                ref={fromButtonRef}
                onClick={(e) => handleModalOpen(e, true)}
                className={`w-full text-center text-2xl font-bold ${validationErrors.from ? 'text-red-500 animate-pulse' : 'text-gray-700'} hover:text-gray-900 transition-colors`}
              >
                {fromLocation || "Chọn điểm đi"}
              </button>
            </motion.div>

            <motion.div
              custom={{ y: 50 }}
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-green-400 to-blue-400 p-3 rounded-full cursor-pointer"
              onClick={swapLocations}
            >
              <FaExchangeAlt className="text-white text-xl" />
            </motion.div>

            <motion.div custom={{ x: 50 }} variants={itemVariants} className="w-full md:w-5/12 text-center">
              <label className="block text-gray-600 text-lg font-medium mb-3 text-center">Điểm đến</label>
              <button
                ref={toButtonRef}
                onClick={(e) => handleModalOpen(e, false)}
                className={`w-full text-center text-2xl font-bold ${validationErrors.to ? 'text-red-500 animate-pulse' : 'text-gray-700'} hover:text-gray-900 transition-colors`}
              >
                {toLocation || "Chọn điểm đến"}
              </button>
            </motion.div>
          </div>

          <motion.div custom={{ y: 30 }} variants={itemVariants} className="flex flex-col md:flex-row gap-6 items-end justify-center">
            <div className="relative w-full md:w-1/3">
              <label className="block text-gray-600 text-lg font-medium mb-3">Ngày đi</label>
              <div
                className="flex items-center justify-between p-4 rounded-xl cursor-pointer bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition-colors border border-green-100"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <span className="text-gray-700">{date.toLocaleDateString("vi-VN")}</span>
                <FaCalendar className="text-blue-400" />
              </div>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-2 bg-white rounded-xl shadow-2xl border border-green-100"
                >
                  <div className="p-4">
                    <input 
                      type="date" 
                      value={date.toISOString().split('T')[0]}
                      onChange={(e) => {
                        setDate(new Date(e.target.value));
                        setShowCalendar(false);
                      }}
                      className="w-full bg-gradient-to-r from-green-50 to-blue-50 text-gray-700 rounded-lg p-2 border border-green-100"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              custom={{ y: 30 }}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="w-full md:w-1/3 bg-gradient-to-r from-green-400 to-blue-400 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Tìm chuyến xe
            </motion.button>
          </motion.div>
        </motion.div>

        <LocationModal
          isOpen={showFromModal}
          onClose={() => setShowFromModal(false)}
          locations={locations}
          onSelect={(location) => {
            setFromLocation(location);
            setValidationErrors(prev => ({ ...prev, from: false }));
          }}
          title="Chọn điểm đi"
          position={modalPosition}
        />

        <LocationModal
          isOpen={showToModal}
          onClose={() => setShowToModal(false)}
          locations={locations}
          onSelect={(location) => {
            setToLocation(location);
            setValidationErrors(prev => ({ ...prev, to: false }));
          }}
          title="Chọn điểm đến"
          position={modalPosition}
        />

        {/* Hot Destinations Section */}
        <motion.div custom={{ x: -30 }} variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chuyến đi hot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                custom={{ x: index % 2 === 0 ? -30 : 30 }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-lg rounded-xl overflow-hidden border border-green-100 shadow-lg"
              >
                <img src={destination.image} alt={destination.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">{destination.title}</h3>
                  <p className="text-blue-500 font-semibold mt-2">{destination.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Promotions Section */}
        <motion.div custom={{ x: 30 }} variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ưu đãi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotions.map((promotion, index) => (
              <motion.div
                key={promotion.id}
                custom={{ x: index % 2 === 0 ? -30 : 30 }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-lg rounded-xl overflow-hidden border border-green-100 shadow-lg flex"
              >
                <img src={promotion.image} alt={promotion.title} className="w-1/3 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">{promotion.title}</h3>
                  <p className="text-gray-600 mt-2">{promotion.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        custom={{ y: 50 }}
        variants={itemVariants}
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-green-100 px-6 py-4 shadow-lg"
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E9D5FF;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D8B4FE;
        }
      `}</style>
    </motion.div>
  );
};

export default BookingPage;