'use client';

import React, { useState } from "react";
import { FaArrowLeft, FaBus, FaExclamationCircle, FaMapMarkerAlt, FaFilter, FaSort } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SearchResultsPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

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
      route: "Hà Nội → Hải Dương → Hải Phòng"
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
      route: "Hà Nội → Hưng Yên → Hải Phòng"
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
      route: "Hà Nội → Bắc Ninh → Hải Phòng"
    }
  ]);

  const getDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric"
    }).format(date);
  };

  const formatDay = (date) => {
    const days = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba", 
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy"
    ];
    return days[date.getDay()];
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleSort = (option) => {
    setSortOption(option);
    setShowSortModal(false);
  };

  const handleFilter = () => {
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setSelectedCompanies([]);
    setPriceRange({ min: 0, max: 1000000 });
    setShowFilterModal(false);
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-blue-200 to-yellow-200 pb-20">
      <div className="bg-transparent p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300">
              <FaArrowLeft className="text-gray-600 text-xl" />
            </button>
            <div className="flex items-center gap-1 text-gray-600 font-semibold">
              <span className="text-base">{tickets[0].from}</span>
              <span className="text-base">→</span>
              <span className="text-base">{tickets[0].to}</span>
              <span className="text-base">•</span>
              <span className="text-base">{formatDate(selectedDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-transparent mt-2 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitScrollbar: {display: 'none'}}}>
            <div className="inline-flex space-x-4 w-max">
              {getDates().map((date, index) => (
                <motion.div
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateSelect(date)}
                  className={`flex flex-col items-center min-w-[80px] p-2 rounded-lg cursor-pointer transition-all duration-300 flex-shrink-0 ${date.toDateString() === selectedDate.toDateString() ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/80 text-gray-600 hover:bg-blue-50'}`}
                >
                  <span className="text-sm font-medium">{formatDay(date)}</span>
                  <span className="text-xs font-medium mt-1">{formatDate(date)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-4 px-4 space-y-4">
        {tickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-4 shadow-lg relative overflow-hidden"
          >
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
                <button className="flex items-center mt-2 text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  <span>Lộ trình</span>
                </button>
              </div>
              <div className="flex flex-col items-end">
                <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-300">
                  <span className="mr-1">Chi tiết xe</span>
                  <FaExclamationCircle />
                </button>
                <div className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                  {ticket.seatsAvailable} chỗ trống
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[60%] max-w-sm z-50">
        <div className="bg-gradient-to-r from-green-300/50 to-blue-300/50 backdrop-blur-sm rounded-full shadow-lg p-2 flex justify-around items-center space-x-2">
          <button
            onClick={() => setShowSortModal(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all duration-300 text-sm"
          >
            <FaSort className="text-gray-700" />
            <span className="text-gray-700">Sắp xếp</span>
          </button>
          <div className="w-px h-4 bg-gray-400/50"></div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all duration-300 text-sm"
          >
            <FaFilter className="text-gray-700" />
            <span className="text-gray-700">Bộ lọc</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSortModal && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 m-4 w-full max-w-md shadow-xl border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">Sắp xếp theo</h3>
              <div className="space-y-3">
                {[
                  { label: "Giá tăng dần", value: "price-asc" },
                  { label: "Giá giảm dần", value: "price-desc" },
                  { label: "Giờ đi tăng dần", value: "time-asc" },
                  { label: "Giờ đi giảm dần", value: "time-desc" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSort(option.value)}
                    className="w-full text-left p-4 rounded-xl hover:bg-green-50/50 transition-all duration-300 flex items-center justify-between group"
                  >
                    <span className="text-gray-700 group-hover:text-green-600 transition-colors">{option.label}</span>
                    {sortOption === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-green-500"
                      />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowSortModal(false)}
                className="mt-6 w-full p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 font-medium"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 m-4 w-full max-w-md shadow-xl border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">Bộ lọc</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4 text-gray-700">Nhà xe</h4>
                  <div className="space-y-3">
                    {["Hoàng Long", "Phương Trang", "Thành Bưởi"].map((company) => (
                      <label key={company} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50/50 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCompanies.includes(company)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCompanies([...selectedCompanies, company]);
                            } else {
                              setSelectedCompanies(selectedCompanies.filter(c => c !== company));
                            }
                          }}
                          className="w-5 h-5 rounded-md text-green-500 border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-gray-700">{company}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4 text-gray-700">Khoảng giá</h4>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="50000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>0đ</span>
                      <span>{priceRange.max}đ</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={handleFilter}
                  className="flex-1 p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 font-medium"
                >
                  Áp dụng
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300 font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResultsPage;