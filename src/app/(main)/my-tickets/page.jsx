"use client";

import LoadingOverlay from "@/components/loading-overlay";
import PendingOverlay from "@/components/pending-overlay";
import { useUserInfomation } from "@/firebase/authenticate";
import { changeMembershipById } from "@/services/membership";
import { getDetailRoute, removeBookedSeats } from "@/services/routes";
import { getTickets, isValidForCancel, updateTicketStatus } from "@/services/ticket";
import { adjustUserBalance } from "@/services/wallet";
import { formatDate, timeString } from "@/utils/time-manipulation";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaTicketAlt,
  FaTimes,
} from "react-icons/fa";

const TicketHistoryPage = () => {
  const [isLoading, user] = useUserInfomation();
  const [isPending, setIsPending] = useState(false);

  const [tickets, setTickets] = useState();

  const [activeTab, setActiveTab] = useState("history");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [ticketsData, setTicketsData] = useState();
  const [showNotification, setShowNotification] = useState(false);
  const [navActiveTab, setNavActiveTab] = useState("ticket");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      loadTickets();
    })();
  }, [user]);

  async function loadTickets() {
    if (!user) return;

    let data = await getTickets(user.uid);

    setTicketsData(
      await Promise.all(
        data.map(async (d) => {
          const route = await getDetailRoute(d.routeId);
          return {
            ...d,
            id: d.id,
            ticketCode: d.id,
            status: d.status ? "success" : "cancelled",
            from: route.departureLocation,
            to: route.arrivalLocation,
            seatNumber: d.seats.join(", "),
            originalDepartureTime: route.departureTime,
            departureTime: timeString(route.departureTime),
            departureDay: formatDate(route.departureTime),
            passengerInfo: JSON.parse(d.contact),
            tripInfo: {
              route: `${route.departureLocation} - ${route.arrivalLocation}`,
              ticketQuantity: d.seats.length,
              pickupPoint: d.pickup,
              dropoffPoint: d.dropoff,
            },
            payment: {
              price:
                typeof d.price === "number"
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(d.price)
                  : d.price,
              method: "ColorPay",
            },
          };
        })
      )
    );
  }

  const handleCancelTicket = async (ticket, e) => {
    e.stopPropagation();
    setSelectedTicket(ticketsData.find((t) => t.id === ticket.id));
    setShowCancelModal(true);
  };

  const handlePayNow = (ticketId, e) => {
    e.stopPropagation();
    console.log(`Initiating payment for ticket ${ticketId}`);
  };

  const confirmCancellation = async () => {
    if (!termsAccepted) {
      setError("Vui lòng đồng ý với điều kiện và điều khoản!");
      return;
    }

    setIsPending(true);

    const ticket = selectedTicket;

    await updateTicketStatus(user.uid.toString(), ticket.id.toString());
    await adjustUserBalance(user.uid, "Hủy vé", parseInt(ticket.price));
    await changeMembershipById(
      user.uid,
      "Hủy vé",
      -parseInt(ticket.price) / 1_000
    );
    await removeBookedSeats(ticket.routeId, ticket.seats);
    setIsPending(false);

    setTicketsData((prev) =>
      prev.map((ticket) =>
        ticket.id === selectedTicket.id
          ? { ...ticket, status: "cancelled" }
          : ticket
      )
    );

    setShowCancelModal(false);
    setTermsAccepted(false);
    setError("");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-50/85 backdrop-blur-md";
      case "cancelled":
        return "bg-red-50/85 backdrop-blur-md";
      case "pending":
        return "bg-yellow-50/85 backdrop-blur-md";
      default:
        return "bg-gray-50/85 backdrop-blur-md";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "Thanh toán thành công";
      case "cancelled":
        return "Đã hủy";
      case "pending":
        return "Chưa thanh toán";
      default:
        return "Không xác định";
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const getUpcomingTickets = () => {
    const currentDate = new Date();
    return ticketsData.filter((ticket) => {
      const diffTime = Math.abs(
        new Date(ticket.originalDepartureTime.seconds * 1000).getTime() -
          currentDate
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return ticket.status === "success" && diffDays <= 7;
    });
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 rounded-2xl">
      <FaTicketAlt className="text-6xl text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg">Chưa có vé nào ở mục này cả</p>
    </div>
  );

  return !ticketsData ? (
    <LoadingOverlay isLoading />
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-20">
      <PendingOverlay isLoading={isPending} />

      <div className="bg-transparent p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm mb-6">
            <span className="text-gray-600 font-semibold text-lg">
              Vé của tôi
            </span>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Lịch sử vé
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "upcoming"
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Sắp khởi hành
            </button>
          </div>

          <div className="space-y-4">
            {(activeTab === "history" ? ticketsData : getUpcomingTickets())
              .length === 0
              ? renderEmptyState()
              : (activeTab === "history" ? ticketsData : getUpcomingTickets())
                  .slice()
                  .reverse()
                  .map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTicketClick(ticket)}
                      className={`${getStatusBgColor(
                        ticket.status
                      )} rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 border border-white/20 relative`}
                    >
                      {(ticket.status === "success" ||
                        ticket.status === "pending") && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          {ticket.status === "pending" && (
                            <button
                              onClick={(e) => handlePayNow(ticket.id, e)}
                              className="px-3 py-1 bg-green-50 text-green-600 border border-green-500 rounded-lg flex items-center gap-1 hover:bg-green-100 transition-colors"
                            >
                              <FaMoneyBillWave /> Thanh toán ngay
                            </button>
                          )}
                          {isValidForCancel(ticket) && (
                            <button
                              onClick={(e) => handleCancelTicket(ticket, e)}
                              className="px-3 py-1 bg-red-50 text-red-600 border border-red-500 rounded-lg flex items-center gap-1 hover:bg-red-100 transition-colors"
                            >
                              <FaTimes /> Hủy vé
                            </button>
                          )}
                        </div>
                      )}

                      <div className="mb-4 pb-4 border-b border-dashed border-gray-200">
                        <div className="text-lg font-bold text-gray-800 mb-2">
                          Mã vé: {ticket.ticketCode}
                        </div>
                        <div
                          className={`font-medium ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {getStatusText(ticket.status)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-700">
                            {ticket.from}
                          </span>
                          <FaArrowRight className="text-blue-500" />
                          <span className="font-medium text-gray-700">
                            {ticket.to}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          Số ghế: {ticket.seatNumber}
                        </div>
                        <div className="text-gray-600">
                          Giờ xuất bến: {ticket.departureTime},{" "}
                          {ticket.departureDay}, {ticket.departureDate}
                        </div>
                      </div>
                    </motion.div>
                  ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTicketModal && selectedTicket && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 w-full max-w-md shadow-xl border border-white/20 relative mb-20"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 sticky top-0 bg-white/85 py-2">
                Chi tiết vé
              </h3>

              <div
                className="space-y-6 max-h-[calc(100vh-320px)] overflow-y-auto pr-2"
                style={{ scrollbarWidth: "thin" }}
              >
                <section className="space-y-4">
                  <h4 className="font-semibold text-gray-700">
                    Thông tin hành khách
                  </h4>
                  <div className="space-y-2 text-gray-600">
                    <p>Họ và tên: {selectedTicket.passengerInfo.name}</p>
                    <p>Số điện thoại: {selectedTicket.passengerInfo.phone}</p>
                    <p>Email: {selectedTicket.passengerInfo.email}</p>
                    <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg flex items-start">
                      <FaExclamationCircle className="mr-2 mt-1 flex-shrink-0" />
                      Quý khách vui lòng kiểm tra thêm thư rác/Spam trong trường
                      hợp chưa thấy email thông tin Vé ở Hộp thư đến
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="font-semibold text-gray-700">
                    Thông tin lượt đi
                  </h4>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      Trạng thái:{" "}
                      <span className={getStatusColor(selectedTicket.status)}>
                        {getStatusText(selectedTicket.status)}
                      </span>
                    </p>
                    <p>Tuyến xe: {selectedTicket.tripInfo.route}</p>
                    <p>
                      Thời gian khởi hành: {selectedTicket.departureTime},{" "}
                      {selectedTicket.departureDay},{" "}
                      {selectedTicket.departureDate}
                    </p>
                    <p>Số lượng vé: {selectedTicket.tripInfo.ticketQuantity}</p>
                    <p>Vị trí ghế: {selectedTicket.seatNumber}</p>
                    <p>Điểm lên xe: {selectedTicket.tripInfo.pickupPoint}</p>
                    <p>Điểm xuống: {selectedTicket.tripInfo.dropoffPoint}</p>
                    <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg flex items-start">
                      <FaExclamationCircle className="mr-2 mt-1 flex-shrink-0" />
                      Quý khách vui lòng có mặt trước Bến xe/VP BX trước 15 phút
                      so với giờ khởi hành để được kiểm tra thông tin trước khi
                      lên xe
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="font-semibold text-gray-700">
                    Thông tin thanh toán
                  </h4>
                  <div className="space-y-2 text-gray-600">
                    <p>Giá vé: {selectedTicket.payment.price}</p>
                    <p>
                      Phương thức thanh toán: {selectedTicket.payment.method}
                    </p>
                  </div>
                </section>
              </div>

              <button
                onClick={() => setShowTicketModal(false)}
                className="mt-6 w-full p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 font-medium"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-40 p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 w-full max-w-md shadow-xl border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-red-600">
                Xác nhận hủy vé
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn hủy vé không? Việc hủy vé sẽ không thể
                hoàn tác.
              </p>

              <div className="mb-6">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    Tôi đã hiểu và chấp nhận các chính sách hoàn/hủy vé của nhà
                    xe.
                  </span>
                </label>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setTermsAccepted(false);
                    setError("");
                  }}
                  className="flex-1 p-4 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  Quay lại
                </button>
                <button
                  onClick={confirmCancellation}
                  className="flex-1 p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300"
                >
                  Xác nhận hủy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-4 left-20 right-20 z-50 flex justify-center px-4 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            Một vé vừa mới bị hủy
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        * {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        *::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default TicketHistoryPage;
