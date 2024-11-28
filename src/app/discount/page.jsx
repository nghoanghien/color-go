'use client';

import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaHeadset, FaSignOutAlt, FaChevronRight, FaMedal, FaCrown, FaGem, FaCircle, FaTicketAlt, FaHeart, FaGift, FaPercent, FaBus, FaTag, FaInfoCircle, FaTimes, FaClock, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const OfferModal = ({ isOpen, onClose, offerDetails }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{offerDetails.title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              {/* Discount Banner */}
              {offerDetails.discount && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
                  <span className="text-2xl font-bold text-blue-600">{offerDetails.discount}</span>
                  <span className="text-blue-600 ml-1">giảm giá</span>
                </div>
              )}

              {/* Basic Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaTag className="mr-2 text-blue-500" />
                  <span>Đơn hàng tối thiểu: {offerDetails.minOrder || "Không giới hạn"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <span>Có hi���u lực đến: {offerDetails.expiry || "Không thời hạn"}</span>
                </div>
              </div>

              {/* Description */}
              {offerDetails.description && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-gray-600 text-sm">{offerDetails.description}</p>
                </div>
              )}

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-green-500 hover:to-blue-600 transition-colors">
                Sử dụng ngay
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const OffersPage = () => {
  const [activeTab, setActiveTab] = useState("offers");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const carouselImages = [
    "images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
    "images.unsplash.com/photo-1626947346165-4c2288dadc2a",
    "images.unsplash.com/photo-1472851294608-062f824d29cc",
    "images.unsplash.com/photo-1540555700478-4be289fbecef",
    "images.unsplash.com/photo-1626947346165-4c2288dadc2a",
    "images.unsplash.com/photo-1494783367193-149034c05e8f",
    "images.unsplash.com/photo-1682685797332-e678a04f8a64",
    "images.unsplash.com/photo-1682687219640-b3f11f4b7234"
  ];

  const myVouchers = [
    {
      id: 1,
      icon: FaPercent,
      title: "Giảm giá 20%",
      discount: "20%",
      maxDiscount: "100.000đ",
      minOrder: "500.000đ",
      expiry: "31/12/2023",
      description: "Áp dụng cho tất cả các đơn hàng"
    },
    {
      id: 2,
      icon: FaTag,
      title: "Giảm giá cố định",
      discount: "50.000đ",
      maxDiscount: "50.000đ",
      minOrder: "300.000đ",
      expiry: "25/12/2023",
      description: "Áp dụng cho tất cả các đơn hàng"
    }
  ];

  const memberVouchers = [
    {
      id: 1,
      title: "Ưu đãi hội viên Vàng",
      discount: "30%",
      description: "Áp dụng cho tất cả các tuyến",
      expiry: "31/12/2024"
    },
    {
      id: 2,
      title: "Ưu đãi hội viên Bạc",
      discount: "25%",
      description: "Áp dụng cho tất cả các tuyến",
      expiry: "31/12/2024"
    },
    {
      id: 3,
      title: "Ưu đãi hội viên Đồng",
      discount: "20%",
      description: "Áp dụng cho tất cả các tuyến",
      expiry: "31/12/2024"
    }
  ];

  const promotions = [
    {
      id: 1,
      image: "images.unsplash.com/photo-1540555700478-4be289fbecef",
      title: "Khuyến mãi tháng 12",
      discount: "25%",
      description: "Ưu đãi đặc biệt dành cho tháng 12",
      expiry: "31/12/2023"
    },
    {
      id: 2,
      image: "images.unsplash.com/photo-1472851294608-062f824d29cc",
      title: "Ưu đãi cuối năm",
      discount: "30%",
      description: "Ưu đãi đặc biệt dịp cuối năm",
      expiry: "31/12/2023"
    },
    {
      id: 3,
      image: "images.unsplash.com/photo-1626947346165-4c2288dadc2a",
      title: "Khuyến mãi Tết",
      discount: "40%",
      description: "Ưu đãi đặc biệt dịp Tết",
      expiry: "15/02/2024"
    },
    {
      id: 4,
      image: "images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
      title: "Ưu đãi đặc biệt",
      discount: "35%",
      description: "Ưu đãi đặc biệt có giới hạn",
      expiry: "10/01/2024"
    }
  ];

  const navigationItems = [
    { id: "tickets", icon: FaBus, label: "Đặt vé" },
    { id: "favorites", icon: FaHeart, label: "Yêu thích" },
    { id: "mytickets", icon: FaTicketAlt, label: "Vé của tôi" },
    { id: "offers", icon: FaGift, label: "Ưu đãi" },
    { id: "account", icon: FaUser, label: "Tài khoản" }
  ];

  const handleOpenModal = (offer) => {
    setSelectedOffer(offer);
    setModalOpen(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-24">
      {/* Header */}
      <div className="backdrop-blur-sm bg-white/30 p-4 mx-4 mt-4 shadow-lg border border-white/20 rounded-bl-[50%] rounded-br-[50%]">
        <h1 className="text-2xl font-bold text-center text-gray-800">Ưu đãi</h1>
      </div>
      
      {/* Carousel */}
      <div className="relative h-48 overflow-hidden mt-6">
        {carouselImages.map((image, index) => (
          <motion.img
            key={index}
            src={`https://${image}`}
            alt={`Slide ${index}`}
            className="absolute w-full h-full object-cover rounded-xl mx-auto max-w-[95%] left-0 right-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>

      {/* My Vouchers */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Quà của tôi</h2>
        <div className="space-y-4">
          {myVouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="bg-white rounded-lg p-4 shadow-md cursor-pointer transform transition hover:scale-[1.02]"
              onClick={() => handleOpenModal(voucher)}
            >
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <voucher.icon className="text-blue-500 text-xl" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold text-lg text-blue-600">Giảm {voucher.discount}</h3>
                  <p className="text-gray-600">Tối đa {voucher.maxDiscount}</p>
                  <p className="text-gray-500">Đơn tối thiểu {voucher.minOrder}</p>
                  <p className="text-gray-500">HSD: {voucher.expiry}</p>
                </div>
                <button className="text-blue-500 text-sm">Điều kiện</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Vouchers */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Ưu đãi hội viên</h2>
        <div className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {memberVouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="bg-white rounded-lg p-4 shadow-md min-w-[250px] select-none cursor-pointer transform transition hover:scale-[1.02]"
              onClick={() => handleOpenModal(voucher)}
            >
              <h3 className="font-bold text-lg">{voucher.title}</h3>
              <p className="text-2xl font-bold text-blue-600 my-2">Giảm {voucher.discount}</p>
              <p className="text-gray-600">{voucher.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promotions */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Chương trình ưu đãi</h2>
        <div className="grid grid-cols-2 gap-4">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer transform transition hover:scale-[1.02]"
              onClick={() => handleOpenModal(promo)}
            >
              <img src={`https://${promo.image}`} alt={promo.title} className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="font-bold">{promo.title}</h3>
                <p className="text-blue-600 font-bold">Giảm {promo.discount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
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
            onClick={() => setActiveTab("offers")}
            className={`flex flex-col items-center ${activeTab === "offers" ? "text-blue-500" : "text-gray-400"}`}
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

      <OfferModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        offerDetails={selectedOffer}
      />

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

export default OffersPage;