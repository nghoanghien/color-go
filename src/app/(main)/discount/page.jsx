"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaPercent, FaTag, FaTimes } from "react-icons/fa";
import { getPromotions } from "@/services/routes";
import { useRouter } from 'next/navigation';
import LoadingOverlay from "@/components/loading-overlay";


const OfferModal = ({ isOpen, onClose, offerDetails }) => {
  const router = useRouter();
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
                <h3 className="text-xl font-semibold text-gray-800">
                  {offerDetails.title}
                </h3>
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
                  <span className="text-2xl font-bold text-blue-600">
                    {offerDetails.discount}
                  </span>
                  <span className="text-blue-600 ml-1">giảm giá</span>
                </div>
              )}

              {/* Basic Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaTag className="mr-2 text-blue-500" />
                  <span>
                    Đơn hàng tối thiểu:{" "}
                    {offerDetails.minApply ? offerDetails.minApply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "Không giới hạn"}đ
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <span>
                    Có hiệu lực đến: {offerDetails.valid ? new Date(offerDetails.valid.seconds * 1000).toLocaleDateString('vi-VN') : "Không thời hạn"}
                  </span>
                </div>
              </div>

              {/* Description */}
              {offerDetails.description && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-gray-600 text-sm">
                    {offerDetails.description}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button onClick={() => router.push("/booking")} className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-green-500 hover:to-blue-600 transition-colors">
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [myVouchers, setMyVouchers] = useState();

  const carouselImages = [
    "/images/discount1.webp",
    "/images/discount2.jpg",
    "/images/discount3.jpg",
    "/images/discount4.jpg",
    "/images/discount5.jpg",
  ];

  const memberVouchers = [
    {
      id: 1,
      title: "Ưu đãi hội viên Vàng",
      discount: "30%",
      description: "Áp dụng cho tất cả các tuyến",
      expiry: "31/12/2024",
    },
    {
      id: 2,
      title: "Ưu đãi hội viên Bạc",
      discount: "25%",
      description: "Áp dụng cho tất cả các tuyến",
      expiry: "31/12/2024",
    },
    {
      id: 3,
      title: "Ưu đãi hội viên Đồng",
      discount: "20%",
      description: "Áp dụng cho tất cả các tuyến",
      expiry: "31/12/2024",
    },
  ];

  const promotions = [
    {
      id: 1,
      image: "images.unsplash.com/photo-1540555700478-4be289fbecef",
      title: "Khuyến mãi tháng 12",
      discount: "25%",
      description: "Ưu đãi đặc biệt dành cho tháng 12",
      expiry: "31/12/2023",
    },
    {
      id: 2,
      image: "images.unsplash.com/photo-1472851294608-062f824d29cc",
      title: "Ưu đãi cuối năm",
      discount: "30%",
      description: "Ưu đãi đặc biệt dịp cuối năm",
      expiry: "31/12/2023",
    },
    {
      id: 3,
      image: "images.unsplash.com/photo-1626947346165-4c2288dadc2a",
      title: "Khuyến mãi Tết",
      discount: "40%",
      description: "Ưu đãi đặc biệt dịp Tết",
      expiry: "15/02/2024",
    },
    {
      id: 4,
      image: "images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
      title: "Ưu đãi đặc biệt",
      discount: "35%",
      description: "Ưu đãi đặc biệt có giới hạn",
      expiry: "10/01/2024",
    },
  ];

  const handleOpenModal = (offer) => {
    setSelectedOffer(offer);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      const promotions = await getPromotions();
      console.log("Fetched Promotions:", promotions);

      if (Array.isArray(promotions)) {
        setMyVouchers(promotions);
        promotions.forEach((voucher) => {
          console.log("Voucher properties:", Object.keys(voucher));
        });
      } else {
        console.log("Dữ liệu không hợp lệ:", promotions);
      }
    };

    fetchPromotions();
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return !myVouchers ? <LoadingOverlay isLoading /> : (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-24">
      <div className=" mx-auto max-w-4xl">
        {/* Header */}
        <div className="backdrop-blur-sm bg-white/30 p-4 mx-4 mt-0 shadow-lg border border-white/20 rounded-bl-[50%] rounded-br-[50%]">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Ưu đãi
          </h1>
        </div>

        {/* Carousel */}
        <div className="relative h-48 overflow-hidden mt-6">
          {carouselImages.map((image, index) => (
            <motion.img
              key={index}
              src={image}
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
            {myVouchers.length > 0 ? (
              myVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-white rounded-lg p-4 shadow-md cursor-pointer transform transition hover:scale-[1.02]"
                  onClick={() => handleOpenModal(voucher)}
                >
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      {voucher.icon ? (
                        <voucher.icon className="text-blue-500 text-xl" />
                      ) : (
                        <FaTag className="text-blue-500 text-xl" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold text-lg text-blue-600">
                        {voucher.title}
                      </h3>
                      <p className="text-gray-600">
                        Mã giảm giá: {voucher.code}
                      </p>
                      <p className="text-gray-600">
                        Tối đa: {voucher.max ? voucher.max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "Không giới hạn"}đ
                      </p>
                      <p className="text-gray-500">
                        Đơn tối thiểu: {voucher.minApply ? voucher.minApply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "Không yêu cầu"}đ
                      </p>
                      <p className="text-gray-500">HSD: {voucher.valid ? new Date(voucher.valid.seconds * 1000).toLocaleDateString('vi-VN') : "Không thời hạn"}</p>
                    </div>
                    <button className="text-blue-500 text-sm">Điều kiện</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Bạn chưa có voucher nào.</p>
            )}
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
                <p className="text-2xl font-bold text-blue-600 my-2">
                  Giảm {voucher.discount}
                </p>
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
                <img
                  src={`https://${promo.image}`}
                  alt={promo.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-bold">{promo.title}</h3>
                  <p className="text-blue-600 font-bold">
                    Giảm {promo.discount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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