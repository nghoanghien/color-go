"use client";

import LoadingOverlay from "@/components/loading-overlay";
import { useUserInfomation } from "@/firebase/authenticate";
import { getRouteList } from "@/services/routes";
import { addTicketToFavorites, removeTicketFromFavorites } from "@/services/user";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaBus,
  FaExclamationCircle,
  FaFilter,
  FaHeart,
  FaMapMarker,
  FaMapMarkerAlt,
  FaSort,
} from "react-icons/fa";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = new Date(parseInt(searchParams.get("date")));

  const selectedDateRef = useRef(null);

  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(date);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [favorites, setFavorites] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const [isLoading, user] = useUserInfomation();

  useEffect(() => {
    (async () => {
      const data = await getRouteList(from, to, selectedDate);
      setTickets(data);
      setOriginalTickets(data);
    })();
  }, [selectedDate]);

  const [originalTickets, setOriginalTickets] = useState([]);

  const [tickets, setTickets] = useState(originalTickets);

  const toggleFavorite = (ticketId) => {
    const isFavorite = favorites.includes(ticketId);
    if (isFavorite) {
      setFavorites(favorites.filter((id) => id !== ticketId));
      removeTicketFromFavorites(user.uid, ticketId);
      showNotification("Đã xóa khỏi danh sách yêu thích");
    } else {
      setFavorites([...favorites, ticketId]);
      addTicketToFavorites(user.uid, ticketId);
      showNotification("Đã thêm vào danh sách yêu thích");
    }
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 3000);
  };

  const DATE_ABSOLUTE_OFFSET = 8;
  const getDates = () => {
    const dates = [];
    for (let i = -DATE_ABSOLUTE_OFFSET; i <= DATE_ABSOLUTE_OFFSET; i++) {
      const currDate = new Date(date);
      currDate.setDate(currDate.getDate() + i);
      if (currDate.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000) continue;
      dates.push(currDate);
    }
    return dates;
  };

  const formatDate = (date) => {
    if (isNaN(date.getTime())) {
      return ""; // Return an empty string if the date is invalid
    }
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric",
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
      "Thứ Bảy",
    ];
    return days[date.getDay()];
  };

  const handleDateSelect = (date) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", date.getTime().toString());

    router.replace(`/search-tickets?${params.toString()}`);

    setSelectedDate(date);
  };

  const handleSort = (option) => {
    setSortOption(option);
    setShowSortModal(false);
    sortTickets(option);
  };

  const sortTickets = (option) => {
    let sortedTickets = [...tickets];
    if (option === "price-asc") {
      sortedTickets.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (option === "price-desc") {
      sortedTickets.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (option === "time-asc") {
      sortedTickets.sort((a, b) => {
        const timeA = a.departureTime.seconds;
        const timeB = b.departureTime.seconds;
        return timeA - timeB;
      });
    } else if (option === "time-desc") {
      sortedTickets.sort((a, b) => {
        const timeA = a.departureTime.seconds;
        const timeB = b.departureTime.seconds;
        return timeB - timeA;
      });
    }
    setTickets(sortedTickets);
  };

  const handleFilter = () => {
    const filteredTickets = originalTickets.filter((ticket) => {
      const withinPriceRange =
        parseFloat(ticket.price) >= priceRange.min &&
        parseFloat(ticket.price) <= priceRange.max;
      const matchesCompany =
        selectedCompanies.length === 0 ||
        selectedCompanies.includes(ticket.name);
      return withinPriceRange && matchesCompany;
    });
    setTickets(filteredTickets);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setSelectedCompanies([]);
    setPriceRange({ min: 0, max: 1000000 });
    setShowFilterModal(false);
    setTickets(originalTickets); // Reset to original tickets
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  const handleRouteClick = (stops) => {
    setSelectedRoute(stops);
    setShowRouteModal(true);
  };

  const handleClickTicket = (id) => {
    router.push(`/choose?id=${id}`);
  };

  const timeString = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    //return ""; // Trả về chuỗi rỗng nếu không có timestamp hợp lệ
  };

  useEffect(() => {
    selectedDateRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-20">
      {/* Phần thông báo cho nút trái tim yêu thích */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
          >
            <div className="w-full max-w-md px-6 py-3 bg-gradient-to-r from-blue-500/40 to-green-500/40 backdrop-blur-sm text-white shadow-lg text-center rounded-full font-bold text-base">
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thanh trên cùng có nút mũi tên quay lại */}
      <div className="bg-transparent p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <button
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-300"
              onClick={() => router.back()}
            >
              <FaArrowLeft className="text-gray-600 text-xl" />
            </button>
            <div className="flex items-center gap-1 text-gray-600 font-semibold">
              <span className="text-base">{from}</span>
              <span className="text-base">→</span>
              <span className="text-base">{to}</span>
              <span className="text-base">•</span>
              <span className="text-base">{formatDate(selectedDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh cuộn chọn ngày */}
      <div className="bg-transparent mt-2 p-4">
        <div className="max-w-2xl mx-auto">
          <div
            className="overflow-x-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
            }}
          >
            <div className="inline-flex space-x-4 w-max">
              {getDates().map((date, index) => (
                <motion.div
                  ref={
                    date.toDateString() === selectedDate.toDateString()
                      ? selectedDateRef
                      : undefined
                  }
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateSelect(date)}
                  className={`flex flex-col items-center min-w-[80px] p-2 rounded-lg cursor-pointer transition-all duration-300 flex-shrink-0 ${
                    date.toDateString() === selectedDate.toDateString()
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-white/80 text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-sm font-medium">{formatDay(date)}</span>
                  <span className="text-xs font-medium mt-1">
                    {formatDate(date)}
                  </span>
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
            className={`bg-white rounded-2xl p-4 shadow-lg relative overflow-hidden transition-all duration-500 ${
              favorites.includes(ticket.id) ? "hover:shadow-rainbow" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex flex-col w-full">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-xl font-bold text-gray-800">
                    {timeString(ticket.departureTime)}
                  </div>
                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="border-t-2 border-dashed border-gray-300 w-full absolute"></div>
                    <div className="transform rotate-0 bg-white px-2 z-10">
                      <FaBus className="text-gray-500 text-xl" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {timeString(ticket.arrivalTime)}
                  </div>
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
                    onClick={() => toggleFavorite(ticket.id)}
                    className="flex items-center justify-center p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-300"
                  >
                    <FaHeart
                      className={`text-sm transition-colors duration-300 ${
                        favorites.includes(ticket.id)
                          ? "text-[#ff4757]"
                          : "text-[#ccc]"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full border-t border-dashed border-gray-300 my-4"></div>

            <div className="flex justify-between items-start relative z-10">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {ticket.name}
                </h2>
                <button
                  onClick={() => handleRouteClick(ticket.stops)}
                  className="flex items-center mt-2 text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300"
                >
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  <span className="font-semibold">Lộ trình</span>
                </button>
              </div>
              <div className="flex flex-col items-end w-fit flex-shrink-0">
                <div className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                  {ticket.totalSeat} chỗ trống
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* khung "Sắp xếp và Bộ lọc" */}
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

      {/* Modal cho button "Lộ trình" */}
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
              <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Lộ trình chi tiết
              </h3>

              <div className="space-y-6 relative">
                {selectedRoute.map((stop, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-16 text-sm text-gray-600 pt-1">
                      {timeString(stop.datetime)}
                    </div>

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
                  Lưu ý: Lịch trình chỉ là dự kiến và có thể thay đổi tùy vào
                  tình hình giao thông.
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

      {/* Modal cho button "Sắp xếp" */}
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
              <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Sắp xếp theo
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Giá tăng dần", value: "price-asc" },
                  { label: "Giá giảm dần", value: "price-desc" },
                  { label: "Giờ đi tăng dần", value: "time-asc" },
                  { label: "Giờ đi giảm dần", value: "time-desc" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSort(option.value)}
                    className="w-full text-left p-4 rounded-xl hover:bg-green-50/50 transition-all duration-300 flex items-center justify-between group"
                  >
                    <span className="text-gray-700 group-hover:text-green-600 transition-colors">
                      {option.label}
                    </span>
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

      {/* Modal cho button "Bộ lọc" */}
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
              <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Bộ lọc
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4 text-gray-700">Nhà xe</h4>
                  <div className="space-y-3">
                    {Array.from(new Set(originalTickets.map(d => d.name)).values()).map(
                      (company) => (
                        <label
                          key={company}
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50/50 transition-all cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCompanies.includes(company)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCompanies([
                                  ...selectedCompanies,
                                  company,
                                ]);
                              } else {
                                setSelectedCompanies(
                                  selectedCompanies.filter((c) => c !== company)
                                );
                              }
                            }}
                            className="w-5 h-5 rounded-md text-green-500 border-gray-300 focus:ring-green-500"
                          />
                          <span className="text-gray-700">{company}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4 text-gray-700">Khoảng giá</h4>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
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

      <style jsx>{`
        @keyframes rainbow-shadow {
          0% {
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
          }
          25% {
            box-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
          }
          75% {
            box-shadow: 0 0 10px rgba(0, 128, 0, 0.5);
          }
          100% {
            box-shadow: 0 0 10px rgba(0, 0, 255, 0.5);
          }
        }
        .hover\:shadow-rainbow:hover {
          animation: rainbow-shadow 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default () => {
  return <Suspense fallback={<LoadingOverlay isLoading />}>
    <SearchResultsPage />
  </Suspense>
};