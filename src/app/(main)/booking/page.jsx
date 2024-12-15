'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaExchangeAlt, FaTimes } from "react-icons/fa";
import { useRouter } from 'next/navigation';

import LocationModal from "@/components/location-modal"

const BookingPage = () => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
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
      image: "/images/da-lat.jpg",
      title: "Đà Lạt",
      price: "200.000đ"
    },
    {
      id: 2,
      image: "/images/nha-trang.jpg",
      title: "Nha Trang",
      price: "180.000đ"
    },
    {
      id: 3,
      image: "/images/vung-tau.jpg",
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
      router.push(`/search-tickets?from=${fromLocation}&to=${toLocation}&date=${date.getTime()}`);
    }
  };

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

  const DatePickerModal = ({ isOpen, onClose, selectedDate, onSelectDate }) => {
    const modalVariants = {
      hidden: { opacity: 0, y: 50, scale: 0.95 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          type: "spring",
          duration: 0.3,
          bounce: 0.2
        }
      },
      exit: { 
        opacity: 0, 
        y: 50, 
        scale: 0.95,
        transition: {
          duration: 0.2
        }
      }
    };

    const [currentMonth, setCurrentMonth] = useState(() => {
      // Khởi tạo calendar với tháng của ngày đang được chọn
      return selectedDate || new Date();
    });

    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      
      const days = [];
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }
      
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
      
      return days;
    };

    const isDateDisabled = (date) => {
      if (!date) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    };

    const formatDate = (date) => {
      return new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-4 bg-black/40 backdrop-blur-md rounded-[2.5rem]"
              onClick={onClose}
            />
            
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white/90 backdrop-blur-md rounded-3xl p-6 m-4 w-full max-w-md shadow-xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaChevronLeft className="text-gray-600" />
                  </button>
                  <span className="font-medium text-gray-600">
                    {new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(currentMonth)}
                  </span>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaChevronRight className="text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                  <div key={day} className="text-center text-gray-600 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentMonth).map((date, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isDateDisabled(date)}
                    onClick={() => {
                      if (date) {
                        onSelectDate(date);
                        onClose();
                      }
                    }}
                    className={`
                      p-2 rounded-lg text-center relative
                      ${!date ? 'invisible' : ''}
                      ${isDateDisabled(date) ? 'text-gray-300 cursor-not-allowed' : 
                        date?.toDateString() === selectedDate?.toDateString()
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                          : 'hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50'
                      }
                    `}
                  >
                    {date?.getDate()}
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                <p className="text-sm text-yellow-700 flex items-start">
                  <FaCalendarAlt className="mr-2 mt-1 flex-shrink-0" />
                  Ngày đã chọn: {selectedDate ? formatDate(selectedDate) : "Chưa chọn ngày"}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-yellow-50"
    >
      <div className=" mx-auto p-6 pb-24 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl mb-8 border border-green-100"
        >
          <motion.h1 
            custom={{ x: -100 }}
            variants={itemVariants}
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent"
          >
            Đặt vé xe khách
          </motion.h1>
          <p className="text-lg bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-8 italic">
            "Cuộc sống là những hành trình đầy sắc màu"
          </p>
          
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
                onClick={() => setShowCalendar(true)}
              >
                <span className="text-gray-700">{date.toLocaleDateString("vi-VN")}</span>
                <FaCalendarAlt className="text-blue-400" />
              </div>
            </div>

            <DatePickerModal
              isOpen={showCalendar}
              onClose={() => setShowCalendar(false)}
              selectedDate={date}
              onSelectDate={setDate}
            />

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
          type='departure'
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
          type='arrival'
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

      <style jsx global>{`
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
};

export default BookingPage;