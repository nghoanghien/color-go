"use client";

import LoadingOverlay from "@/components/loading-overlay";
import PendingOverlay from "@/components/pending-overlay";
import { useRouteDetail } from "@/hooks/useRouteDetail";
import { formatDate, timeString } from "@/utils/time-manipulation";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBus,
  FaExclamationCircle,
  FaPen,
  FaTimes
} from "react-icons/fa";

const TripInfoPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);


  const [showContactModal, setShowContactModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalError, setModalError] = useState("");
  const [showContactError, setShowContactError] = useState(false);

  const [contactInfo, setContactInfo] = useState(
    searchParams.has("contact")
      ? JSON.parse(searchParams.get("contact"))
      : {
          name: "",
          phone: "",
          email: "",
        }
  );

  const [isLoading, route] = useRouteDetail(searchParams.get("id"));

  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    (async () => {
      if (!route.stops) return;
      const pickup = route.stops.find(
        (d) => d.stop == searchParams.get("pickup")
      );
      const dropoff = route.stops.find(
        (d) => d.stop == searchParams.get("dropoff")
      );

      const tripData = {
        busCompany: route.name,
        selectedSeats: searchParams.get("seats").split(","),
        departure: {
          time: timeString(pickup.datetime),
          date: formatDate(route.departureTime),
          location: route.departureLocation,
          pickupPoint: pickup.address,
        },
        arrival: {
          time: timeString(dropoff.datetime),
          date: formatDate(route.arrivalTime),
          location: route.arrivalLocation,
          dropoffPoint: dropoff.address,
        },
        duration: `${Math.floor(
          (dropoff.datetime - pickup.datetime) / 60 / 60
        )} giờ`,
        price: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(route.price * searchParams.get("seats").split(",").length),
      };

      setTripData(tripData);
    })();
  }, [route]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("contact", JSON.stringify(contactInfo));

    router.replace(`/ticket-info?${newSearchParams.toString()}`);
  }, [contactInfo]);

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  const handleContactInfoChange = (field, value) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateContactInfo = () => {
    if (!contactInfo.name.trim()) {
      setModalError("Vui lòng nhập họ tên");
      return false;
    }
    if (!contactInfo.phone.trim()) {
      setModalError("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!contactInfo.email.trim()) {
      setModalError("Vui lòng nhập email");
      return false;
    }
    return true;
  };

  const handleConfirmContact = () => {
    if (validateContactInfo()) {
      setShowContactModal(false);
      setModalError("");
    }
  };

  const handlePayment = () => {
    if (!contactInfo.name || !contactInfo.phone || !contactInfo.email) {
      setShowContactError(true);
      setTimeout(() => setShowContactError(false), 3000);
      return;
    }

    if (!acceptTerms) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsPending(true);
    // Handle payment logic
    router.push(`/payment?${searchParams.toString()}`);
  };

  return !tripData ? (
    <LoadingOverlay isLoading />
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-32">
      <PendingOverlay isLoading={isPending} />
      <div className="bg-transparent p-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300">
            <FaArrowLeft
              className="text-gray-600 text-xl"
              onClick={() => {
                router.back();
              }}
            />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            Thông tin chuyến đi
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-6 mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Chuyến đi của bạn
        </h2>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-blue-600">
                {tripData.busCompany}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Số ghế:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tripData.selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 text-sm"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1 space-y-1">
                <div className="text-2xl font-bold text-gray-800">
                  {tripData.departure.time}
                </div>
                <div className="text-sm text-gray-600">
                  {tripData.departure.date}
                </div>
                <div className="text-base font-medium text-gray-800">
                  {tripData.departure.location}
                </div>
                <div className="text-sm text-gray-600">
                  {tripData.departure.pickupPoint}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-base font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  {tripData.duration}
                </div>
                <div className="w-16 border-t-2 border-dashed border-gray-300 my-2 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <FaBus className="text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-1 text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {tripData.arrival.time}
                </div>
                <div className="text-sm text-gray-600">
                  {tripData.arrival.date}
                </div>
                <div className="text-base font-medium text-gray-800">
                  {tripData.arrival.location}
                </div>
                <div className="text-sm text-gray-600">
                  {tripData.arrival.dropoffPoint}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Thông tin liên hệ
          </h2>
          <div
            onClick={() => setShowContactModal(true)}
            className="bg-white p-4 rounded-xl flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-300"
          >
            <input
              type="text"
              placeholder="Nhập thông tin liên hệ"
              className="w-full bg-transparent outline-none"
              value={`${contactInfo.name ? contactInfo.name + " - " : ""}${
                contactInfo.phone ? contactInfo.phone + " - " : ""
              }${contactInfo.email}`}
              readOnly
            />
            <FaPen className="text-gray-400" />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            Tôi đồng ý với{" "}
            <button
              onClick={() => setShowTermsModal(true)}
              className="text-blue-500 hover:underline"
            >
              điều kiện, điều khoản
            </button>{" "}
            của nhà xe, cũng như chính sách hoàn/hủy vé trong phần thông tin
            phía trên
          </label>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            {tripData.price}
          </div>
          <button
            onClick={handlePayment}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 font-medium"
          >
            Thanh toán
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <FaExclamationCircle />
              <span>Vui lòng đồng ý với điều khoản và điều kiện</span>
            </div>
          </motion.div>
        )}

        {showContactError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <FaExclamationCircle />
              <span>Vui lòng nhập đầy đủ thông tin liên hệ</span>
            </div>
          </motion.div>
        )}

        {showContactModal && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 m-4 w-full max-w-md shadow-xl border border-white/20 relative"
            >
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <FaTimes className="text-gray-500" />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Thông tin liên hệ
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) =>
                      handleContactInfoChange("name", e.target.value)
                    }
                    placeholder="Nhập họ tên của bạn"
                    className="w-full p-4 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      handleContactInfoChange("phone", e.target.value)
                    }
                    placeholder="Nhập số điện thoại"
                    className="w-full p-4 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) =>
                      handleContactInfoChange("email", e.target.value)
                    }
                    placeholder="Nhập địa chỉ email"
                    className="w-full p-4 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>
              {modalError && (
                <div className="mt-4 text-red-500 text-sm">{modalError}</div>
              )}
              <button
                onClick={handleConfirmContact}
                className="w-full mt-6 p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 font-medium"
              >
                Xác nhận
              </button>
            </motion.div>
          </div>
        )}

        {showTermsModal && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 m-4 w-full max-w-md shadow-xl border border-white/20 max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Điều khoản và điều kiện
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>1. Chính sách đặt vé...</p>
                <p>2. Chính sách hoàn/hủy vé...</p>
                <p>3. Quy định hành lý...</p>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full mt-6 p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 font-medium"
              >
                Đã hiểu
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default () => {
  return <Suspense fallback={<LoadingOverlay isLoading />}>
    <TripInfoPage />
  </Suspense>
};