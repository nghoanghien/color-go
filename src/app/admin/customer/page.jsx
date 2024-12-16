'use client';

"use client";

import React, { useState } from "react";
import { FaFilePdf, FaHome, FaBus, FaRoute, FaFileInvoice, FaSignOutAlt, FaUsers, FaChevronLeft, FaSearch, FaTrash, FaFileDownload, FaSort, FaSortAmountDown, FaSortAmountUp, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminCustomers = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [customersData, setCustomersData] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      points: 150,
      balance: 2000000,
      tickets: [
        {
          id: 1,
          customerName: "Nguyễn Văn A",
          phone: "0123456789",
          pickupPoint: "Bến xe miền Đông",
          dropoffPoint: "Bến xe Đà Lạt",
          departureTime: "2024-02-20 08:00",
          seatNumber: "A01",
          price: 250000
        },
        {
          id: 2,
          customerName: "Nguyễn Văn A",
          phone: "0123456789",
          pickupPoint: "Bến xe Đà Lạt",
          dropoffPoint: "Bến xe miền Đông",
          departureTime: "2024-02-25 15:30",
          seatNumber: "B03",
          price: 250000
        }
      ]
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      points: 80,
      balance: 1500000,
      tickets: [
        {
          id: 3,
          customerName: "Trần Thị B",
          phone: "0987654321",
          pickupPoint: "Bến xe miền Tây",
          dropoffPoint: "Bến xe Cần Thơ",
          departureTime: "2024-02-22 10:00",
          seatNumber: "C02",
          price: 180000
        }
      ]
    }
  ]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const sidebarItems = [
    { id: "home", label: "Trang chủ", icon: <FaHome /> },
    { id: "transport", label: "Nhà xe", icon: <FaBus /> },
    { id: "routes", label: "Chuyến xe", icon: <FaRoute /> },
    { id: "invoices", label: "Hóa Đơn", icon: <FaFileInvoice /> },
    { id: "customers", label: "Khách Hàng", icon: <FaUsers /> },
    { id: "logout", label: "Đăng xuất", icon: <FaSignOutAlt /> }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      setCustomersData(customersData.filter(customer => customer.id !== id));
      showNotification("Xóa khách hàng thành công!", "success");
    }
  };

  const handleDeleteTicket = (customerId, ticketId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vé này?")) {
      setCustomersData(customersData.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            tickets: customer.tickets.filter(ticket => ticket.id !== ticketId)
          };
        }
        return customer;
      }));
      showNotification("Xóa vé thành công!", "success");
    }
  };

  const handleExport = () => {
    const data = customersData.map(({ tickets, ...rest }) => rest);
    const csv = data.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortOrder("asc");
    }
  };

  const sortedCustomers = [...customersData]
    .sort((a, b) => {
      if (!sortBy) return 0;
      const multiplier = sortOrder === "asc" ? 1 : -1;
      return (a[sortBy] - b[sortBy]) * multiplier;
    })
    .filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen w-full flex bg-gray-50 relative">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === "success" ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-red-500 to-red-400"} text-white`}
          >
            {notification.type === "success" ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaTimesCircle className="text-xl" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        animate={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 space-y-2 relative`}
      >
        <div className="mb-8 text-center relative">
          <motion.h2
            initial={{ opacity: isSidebarCollapsed ? 0 : 1 }}
            animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className={`text-2xl font-bold ${isSidebarCollapsed ? "hidden" : "block"}`}
          >
            Quản trị viên
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: isSidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronLeft />
            </motion.div>
          </motion.button>
        </div>
        {sidebarItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "space-x-3"} px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? "bg-white/20 shadow-lg" : "hover:bg-white/10"}`}
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
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Quản lý khách hàng</h1>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <FaFileDownload />
                <span>Xuất Excel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                
                className="bg-gradient-to-r from-red-700 to-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <FaFilePdf />
                <span>Xuất PDF</span>
              </motion.button>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên khách hàng..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleSort("points")}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                <span>Điểm hội viên</span>
                {sortBy === "points" ? (
                  sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />
                ) : (
                  <FaSort />
                )}
              </button>
              <button
                onClick={() => handleSort("balance")}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                <span>Số dư</span>
                {sortBy === "balance" ? (
                  sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />
                ) : (
                  <FaSort />
                )}
              </button>
            </div>
          </div>

          {/* Customers Table */}
          <motion.div layout className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Tên khách hàng</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Điểm Hội viên</th>
                  <th className="px-6 py-4 text-left">Số dư</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedCustomers.map((customer) => (
                  <React.Fragment key={customer.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <td
                        className="px-6 py-4"
                        onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                      >
                        <div className="flex items-center space-x-2">
                          {expandedCustomer === customer.id ? <FaChevronUp /> : <FaChevronDown />}
                          <span>{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{customer.email}</td>
                      <td className="px-6 py-4">{customer.points}</td>
                      <td className="px-6 py-4">{customer.balance.toLocaleString("vi-VN")} VNĐ</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={20} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                    {expandedCustomer === customer.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left">Tên khách hàng</th>
                                  <th className="px-4 py-2 text-left">Số điện thoại</th>
                                  <th className="px-4 py-2 text-left">Điểm đón</th>
                                  <th className="px-4 py-2 text-left">Điểm trả</th>
                                  <th className="px-4 py-2 text-left">Giờ khởi hành</th>
                                  <th className="px-4 py-2 text-left">Số ghế</th>
                                  <th className="px-4 py-2 text-left">Giá tiền</th>
                                  <th className="px-4 py-2 text-center">Thao tác</th>
                                </tr>
                              </thead>
                              <tbody>
                                {customer.tickets.map((ticket) => (
                                  <motion.tr
                                    key={ticket.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b border-gray-200"
                                  >
                                    <td className="px-4 py-2">{ticket.customerName}</td>
                                    <td className="px-4 py-2">{ticket.phone}</td>
                                    <td className="px-4 py-2">{ticket.pickupPoint}</td>
                                    <td className="px-4 py-2">{ticket.dropoffPoint}</td>
                                    <td className="px-4 py-2">{ticket.departureTime}</td>
                                    <td className="px-4 py-2">{ticket.seatNumber}</td>
                                    <td className="px-4 py-2">{ticket.price.toLocaleString("vi-VN")} VNĐ</td>
                                    <td className="px-4 py-2">
                                      <div className="flex justify-center">
                                        <motion.button
                                          whileHover={{ scale: 1.2 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => handleDeleteTicket(customer.id, ticket.id)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <FaTrash size={16} />
                                        </motion.button>
                                      </div>
                                    </td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </motion.tr>
                    )}
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

export default AdminCustomers;
