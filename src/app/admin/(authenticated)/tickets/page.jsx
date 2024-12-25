"use client";


import React, { useState, useEffect } from "react";
import { FaHome, FaBus, FaRoute, FaSignOutAlt, FaUsers, FaChevronLeft, FaSearch, FaTrash, FaAngleDown, FaAngleUp, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaMapMarkerAlt, FaUserCircle, FaGift, FaTicketAlt, FaFileDownload, FaFilePdf, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { getAllTicketsWithUserId, isValidTicket, updateTicketStatus } from "@/services/ticket";
import { getDetailRoute, removeBookedSeats } from "@/services/routes";
import { formatDate } from "@/utils/time-manipulation";
import LoadingOverlay from "@/components/loading-overlay";
import { adjustUserBalance } from "@/services/wallet";
import { changeMembershipById } from "@/services/membership";
import { exportToExcel, exportToPDF, formatDataForExport } from "@/utils/exportPDF";
import PendingOverlay from "@/components/pending-overlay";
import CustomDateRangePicker from "@/components/CustomDateRangePicker";
import AnimatedMultiSelect from "@/components/AnimatedMultiSelect";




const AdminTickets = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);


  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchTransport, setSearchTransport] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [expandedRow, setExpandedRow] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDeparture, setSelectedDeparture] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");


  const [ticketsData, setTicketsData] = useState();


  const [departureLocations, setDepartureLocations] = useState([]);
  const [arrivalLocations, setArrivalLocations] = useState([]);
  const [fileName, setFileName] = useState("DanhSachVeXe");
  const [sheetName, setSheetName] = useState("Vé xe");
  const [title, setTitle] = useState("Danh sách vé xe");
  const [fieldsToExclude, setFieldsToExclude] = useState("id");
  const [desiredColumnOrder, setDesiredColumnOrder] = useState([
    "customerName",
    "transportName",
    "departure",
    "destination",
    "departureTime",
    "seatNumber",
    "phone",
  ])
 
  console.log(ticketsData);
  useEffect(() => {
    (async () => {
      loadTickets();
    })();
  }, []);


  async function loadTickets() {
    let data = await getAllTicketsWithUserId();


    const ticketData = await Promise.all(
      data
        .map(async (ticket) => {
          const route = await getDetailRoute(ticket.routeId);
          const passengerInfo = JSON.parse(ticket.contact);
          setDepartureLocations(prevLocations => {
            if (!prevLocations.includes(route.departureLocation)) {
              return [...prevLocations, route.departureLocation]; // Tạo mảng mới với địa điểm mới
            }
            return prevLocations;
          });
 
          setArrivalLocations(prevLocations => {
            if (!prevLocations.includes(route.arrivalLocation)) {
              return [...prevLocations, route.arrivalLocation]; // Tạo mảng mới với địa điểm mới
            }
            return prevLocations;
          });
 
          return {
            id: ticket.id,
            userId: ticket.userId,
            routeId: ticket.routeId,
            transportName: route.name,
            departure: route.departureLocation,
            destination: route.arrivalLocation,
            date: route.departureTime,
            seatNumber: ticket.seats.join(","),
            customerName: passengerInfo.name,
            email: passengerInfo.email,
            phone: passengerInfo.phone,
            pickupPoint: ticket.pickup,
            dropoffPoint: ticket.dropoff,
            departureTime: route.departureTime,
            price: ticket.price,
            status: ticket.status
          };
        })
    );


    setTicketsData(ticketData);
    console.log(arrivalLocations);
  }


  const handleNavigate = (tab) => {
    setIsPending(true);
    setActiveTab(tab);
    if (tab !== "logout") {
      router.replace(`/admin/${tab}`);
    }
    else {
      router.replace("/admin/admin-login");
    }
  }


  const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="cursor-pointer" onClick={onClick}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaCalendarAlt className="text-blue-500" />
      </div>
      <input
        ref={ref}
        value={value}
        placeholder={placeholder}
        className="p-3 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out"
        readOnly
      />
    </div>
  ));


  const CustomSelect = ({ value, onChange, placeholder, options }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaMapMarkerAlt className="text-blue-500" />
      </div>
      <select
        value={value}
        onChange={onChange}
        className="p-3 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out appearance-none"
        >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <FaAngleDown className="text-gray-400" />
      </div>
    </div>
  );


  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };


  const handleDelete = async (ticket) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vé xe này?")) {
      setIsPending(true);
      await updateTicketStatus(ticket.userId, ticket.id);
      await adjustUserBalance(ticket.userId, "Hủy vé (hệ thống)", parseInt(ticket.price));
      await changeMembershipById(
        ticket.userId,
        "Hủy vé (hệ thống)",
        -parseInt(ticket.price) / 1_000
      );
      await removeBookedSeats(ticket.routeId, ticket.seatNumber.split(","));
      setIsPending(false);


      setTicketsData((prevData) =>
        prevData.map((ticket2) =>
          ticket2.id === ticket.id ? { ...ticket2, status: 0 } : ticket2
        )
      );
      
      showNotification("Xóa vé xe thành công!", "success");
    }
  };


  let filteredTickets;
  if (ticketsData) {
    filteredTickets = ticketsData.filter(ticket => {
      console.log(startDate, new Date(endDate));
      const matchesTransport = ticket.transportName.toLowerCase().includes(searchTransport.toLowerCase());
      const matchesCustomer = ticket.customerName.toLowerCase().includes(searchCustomer.toLowerCase());
      const matchesDeparture = !selectedDeparture || selectedDeparture.includes(ticket.departure) || selectedDeparture.length === 0;
      const matchesDestination = !selectedDestination || selectedDestination.includes(ticket.destination) || selectedDestination.length === 0;
      const ticketDate = new Date(ticket.date.seconds * 1000);
      const matchesDateRange = (!startDate || ticketDate >= startDate) && (!endDate || ticketDate <= endDate);
 
      return matchesTransport && matchesCustomer && matchesDeparture && matchesDestination && matchesDateRange;
    });
  }
   


  const sidebarItems = [
    { id: "dashboard", label: "Trang chủ", icon: <FaHome /> },
    { id: "coach-company", label: "Nhà xe", icon: <FaBus /> },
    { id: "routes", label: "Chuyến xe", icon: <FaRoute /> },
    { id: "promotions", label: "Ưu Đãi", icon: <FaGift /> },
    { id: "customers", label: "Khách Hàng", icon: <FaUsers /> },
    { id: "tickets", label: "Vé xe", icon: <FaTicketAlt /> },
    { id: "account", label: "Tài khoản", icon: <FaUserCircle /> },
    { id: "logout", label: "Đăng xuất", icon: <FaSignOutAlt /> }
  ];


  const handleExportToExcel = () => {
    const fieldsArray = fieldsToExclude.split(',').map(field => field.trim());
    const dataToExport = formatDataForExport(filteredTickets, desiredColumnOrder);
    exportToExcel(dataToExport, fileName, sheetName, fieldsArray);
  };




  const handleExportToPDF = () => {
    const fieldsArray = fieldsToExclude.split(',').map(field => field.trim());
    const dataToExport = formatDataForExport(filteredTickets, desiredColumnOrder);
    exportToPDF(dataToExport, fileName, fieldsArray, title);
  };


  return !ticketsData ? (
    <LoadingOverlay isLoading />
  ) : (
    <div className="min-h-screen w-full flex bg-gray-50 relative">
      <PendingOverlay isLoading={isPending} />
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
          >
            <motion.div
              className={`px-6 py-3 gap-2 z-50 rounded-lg shadow-lg flex items-center ${
                notification.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-green-400"
                  : "bg-gradient-to-r from-red-500 to-red-400"
              } text-white`}
            >
              {notification.type === "success" ? (
                <FaCheckCircle className="text-xl" />
              ) : (
                <FaTimesCircle className="text-xl" />
              )}
              <span>{notification.message}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        animate={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        transition={{ duration: 0.3 }}
        className="rounded-tr-3xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 space-y-2 relative top-0 left-0 h-screen"
        style={{ position: "sticky" }}
      >
        <div className="mb-8 text-center relative">
          <motion.h2
            initial={{ opacity: isSidebarCollapsed ? 0 : 1 }}
            animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
            className={`text-2xl font-bold ${
              isSidebarCollapsed ? "hidden" : "block"
            }`}
          >
            Quản trị viên
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 rounded-full p-1 shadow-lg"
          >
            <motion.div animate={{ rotate: isSidebarCollapsed ? 180 : 0 }}>
              <FaChevronLeft />
            </motion.div>
          </motion.button>
        </div>

        {sidebarItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigate(item.id)}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? "justify-center" : "space-x-3"
            } px-4 py-3 rounded-2xl ${
              activeTab === item.id ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isSidebarCollapsed && <span>{item.label}</span>}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Quản lý vé xe</h1>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportToExcel}
                className="shadow-md bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300 font-medium"
              >
                <FaFileDownload />
                <span>Xuất Excel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportToPDF}
                className="shadow-md bg-gradient-to-r from-red-700 to-red-500 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300 font-medium"
              >
                <FaFilePdf />
                <span>Xuất PDF</span>
              </motion.button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên nhà xe..."
                className="p-3 pl-9 rounded-2xl shadow-lg border-4 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:outline-none w-full shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out"
                value={searchTransport}
                onChange={(e) => setSearchTransport(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên khách hàng..."
                className="p-3 pl-9 rounded-2xl shadow-lg border-4 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:outline-none w-full shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out"
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <CustomDateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}          
                placeholder="Từ ngày"
                //customInput={<CustomDateInput />}
                //dateFormat="dd/MM/yyyy"
                className="p-3 rounded-2xl shadow-lg border-4 border-blue-100 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out"
              />
            </div>

            <div className="flex items-center space-x-2">
              <CustomDateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                isEndDate={true}
                placeholder="Đến ngày"
                //customInput={<CustomDateInput />}
                //dateFormat="dd/MM/yyyy"
                className="p-3 rounded-2xl shadow-lg border-4 border-blue-100 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out"
              />
            </div>
            
            <div className="flex items-center space-x-2">
                <AnimatedMultiSelect
                  options={departureLocations}
                  value={selectedDeparture}
                  onChange={setSelectedDeparture}
                  placeholder="Chọn điểm đi"
                  maxSelections={4} // Đặt là 1 cho single-select
                />
              </div>
            
              <div className="flex items-center space-x-2">
                <AnimatedMultiSelect
                  options={arrivalLocations}
                  value={selectedDestination}
                  onChange={setSelectedDestination}
                  placeholder="Chọn điểm đến"
                  maxSelections={4} // Đặt là 1 cho single-select
                />
              </div>
          </div>

          {/* Tickets Table */}
          <motion.div
            layout
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Tên khách hàng</th>
                  <th className="px-6 py-4 text-left">Nhà xe</th>
                  <th className="px-6 py-4 text-left">Điểm đi</th>
                  <th className="px-6 py-4 text-left">Điểm đến</th>
                  <th className="px-6 py-4 text-left">Ngày đi</th>
                  <th className="px-6 py-4 text-left">Số ghế</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <React.Fragment key={ticket.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        setExpandedRow(
                          expandedRow === ticket.id ? null : ticket.id
                        )
                      }
                    >
                      <td className="px-6 py-4">{ticket.customerName}</td>
                      <td className="px-6 py-4">{ticket.transportName}</td>
                      <td className="px-6 py-4">{ticket.departure}</td>
                      <td className="px-6 py-4">{ticket.destination}</td>
                      <td className="px-6 py-4">{formatDate(ticket.date)}</td>
                      <td className="px-6 py-4">{ticket.seatNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-3">
                          {ticket.status == 1 &&
                            isValidTicket(ticket.date) && (
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(ticket);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash size={20} />
                              </motion.button>
                            )}
                          <motion.div
                            animate={{
                              rotate: expandedRow === ticket.id ? 180 : 0,
                            }}
                            className="text-blue-500"
                          >
                            {expandedRow === ticket.id ? (
                              <FaAngleUp />
                            ) : (
                              <FaAngleDown />
                            )}
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {expandedRow === ticket.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50"
                        >
                          <td colSpan="7" className="px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div>
                                <span className="font-medium">Email:</span>
                                <p>{ticket.email}</p>
                              </div>
                              <div>
                                <span className="font-medium">
                                  Số điện thoại:
                                </span>
                                <p>{ticket.phone}</p>
                              </div>
                              <div>
                                <span className="font-medium">Điểm đón:</span>
                                <p>{ticket.pickupPoint}</p>
                              </div>
                              <div>
                                <span className="font-medium">Điểm trả:</span>
                                <p>{ticket.dropoffPoint}</p>
                              </div>
                              <div>
                                <span className="font-medium">Giá tiền:</span>
                                <p>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(ticket.price)}
                                </p>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};


export default AdminTickets;
