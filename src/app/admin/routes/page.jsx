"use client";

import React, { useState, useCallback } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

import { FaFileDownload, FaFilePdf, FaHome, FaBus, FaRoute, FaFileInvoice, FaSignOutAlt, FaUsers, FaChevronLeft, FaSearch, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaSortAmountDown, FaSortAmountUpAlt, FaGift, FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminRoutes = () => {
  const router = useRouter();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("routes");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortBy, setSortBy] = useState({ field: null, order: "asc" });
  const [filterDeparture, setFilterDeparture] = useState("");
  const [filterArrival, setFilterArrival] = useState("");
  
  const [routesData, setRoutesData] = useState([
    {
      id: 1,
      transportName: "Phương Trang",
      departure: "TP.HCM",
      arrival: "Đà Lạt",
      departureTime: "2024-01-20T06:00:00",
      arrivalTime: "2024-01-20T14:00:00",
      price: 280000,
      stops: [
        {
          name: "Trạm Dầu Giây",
          address: "QL20, Xuân Lộc, Đồng Nai",
          arrivalTime: "2024-01-20T08:30:00"
        },
        {
          name: "Bảo Lộc",
          address: "QL20, Bảo Lộc, Lâm Đồng",
          arrivalTime: "2024-01-20T11:30:00"
        }
      ]
    },
    {
      id: 2,
      transportName: "Thành Bưởi",
      departure: "Hà Nội",
      arrival: "Sapa",
      departureTime: "2024-01-20T20:00:00",
      arrivalTime: "2024-01-21T06:00:00",
      price: 350000,
      stops: [
        {
          name: "Yên Bái",
          address: "QL32, TP. Yên Bái",
          arrivalTime: "2024-01-21T01:30:00"
        },
        {
          name: "Lào Cai",
          address: "QL4D, TP. Lào Cai",
          arrivalTime: "2024-01-21T04:00:00"
        }
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [newRoute, setNewRoute] = useState({
    transportName: "",
    departure: "",
    arrival: "",
    departureTime: new Date(),
    arrivalTime: new Date(),
    price: "",
    stops: []
  });

  const locations = ["TP.HCM", "Hà Nội", "Đà Lạt", "Sapa", "Đà Nẵng", "Nha Trang"];

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const sidebarItems = [
    { id: "dashboard", label: "Trang chủ", icon: <FaHome /> },
    { id: "coach-company", label: "Nhà xe", icon: <FaBus /> },
    { id: "routes", label: "Chuyến xe", icon: <FaRoute /> },
    { id: "promotions", label: "Ưu Đãi", icon: <FaGift /> },
    { id: "customers", label: "Khách Hàng", icon: <FaUsers /> },
    { id: "account", label: "Tài khoản", icon: <FaUserCircle /> },
    { id: "logout", label: "Đăng xuất", icon: <FaSignOutAlt /> }
  ];

  const onDrop = useCallback((acceptedFiles) => {
    // Handle file upload logic here
   // setUploadProgress(100); // Simulate upload completion
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const handleSort = (field) => {
    setSortBy(prev => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc"
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    try {
      if (window.confirm("Bạn có chắc chắn muốn xóa chuyến xe này?")) {
        setRoutesData(routesData.filter(route => route.id !== id));
        showNotification("Xóa chuyến xe thành công!", "success");
      }
    } catch (error) {
      showNotification(`Xóa chuyến xe thất bại: ${error.message}`, "error");
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setNewRoute({
      ...route,
      departureTime: new Date(route.departureTime),
      arrivalTime: new Date(route.arrivalTime)
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRoute(null);
    setNewRoute({
      transportName: "",
      departure: "",
      arrival: "",
      departureTime: new Date(),
      arrivalTime: new Date(),
      price: "",
      stops: []
    });
    setIsModalOpen(true);
  };

  const handleAddStop = () => {
    setNewRoute(prev => ({
      ...prev,
      stops: [...prev.stops, { name: "", address: "", arrivalTime: new Date() }]
    }));
  };

  const handleRemoveStop = (index) => {
    setNewRoute(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        setRoutesData(routesData.map(route =>
          route.id === editingRoute.id ? { ...newRoute, id: route.id } : route
        ));
        showNotification("Cập nhật chuyến xe thành công!", "success");
      } else {
        setRoutesData([...routesData, { ...newRoute, id: routesData.length + 1 }]);
        showNotification("Thêm chuyến xe mới thành công!", "success");
      }
      setIsModalOpen(false);
    } catch (error) {
      showNotification(`Thao tác thất bại: ${error.message}`, "error");
    }
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    if (tab !== "logout") {
      router.replace(`/admin/${tab}`);
    }
    else {
      router.replace("/admin/admin-login");
    }
  }

  const filteredAndSortedRoutes = routesData
    .filter(route =>
      route.transportName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterDeparture || route.departure === filterDeparture) &&
      (!filterArrival || route.arrival === filterArrival)
    )
    .sort((a, b) => {
      if (!sortBy.field) return 0;
      
      let comparison = 0;
      switch (sortBy.field) {
        case "price":
          comparison = a.price - b.price;
          break;
        case "departureTime":
          comparison = new Date(a.departureTime) - new Date(b.departureTime);
          break;
        default:
          comparison = 0;
      }
      return sortBy.order === "asc" ? comparison : -comparison;
    });



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
        className={`bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 space-y-2 relative sticky top-0 left-0 h-screen`}
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
            onClick={() => handleNavigate(item.id)}
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
            <h1 className="text-3xl font-bold text-gray-800">Quản lý chuyến xe</h1>
            <div className="flex space-x-4">
            <motion.button
                {...getRootProps()} // Thêm props cho drag-and-drop
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className={`px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-400 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 font-medium ${
                            isDragActive ? "border border-blue-500 bg-blue-50" : ""
                }`}
              >
                <input {...getInputProps()} hidden /> {/* Ẩn input */}
                <FiUploadCloud className="inline-block w-5 h-5 mr-2 text-white" />
                Tải file
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // onClick={handleExport}
                className="bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <FaFileDownload />
                <span>Xuất Excel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                
                className="bg-gradient-to-r from-red-700 to-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <FaFilePdf />
                <span>Xuất PDF</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <FaPlus />
                <span>Thêm chuyến xe</span>
              </motion.button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên nhà xe..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filterDeparture}
                onChange={(e) => setFilterDeparture(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Điểm đi</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                value={filterArrival}
                onChange={(e) => setFilterArrival(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Điểm đến</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <button
                onClick={() => handleSort("price")}
                className="flex items-center justify-center space-x-2 p-2 border rounded-lg hover:bg-gray-50"
              >
                <span>Giá vé</span>
                {sortBy.field === "price" ? (
                  sortBy.order === "asc" ? <FaSortAmountDown /> : <FaSortAmountUpAlt />
                ) : <FaSortAmountDown className="text-gray-400" />}
              </button>

              <button
                onClick={() => handleSort("departureTime")}
                className="flex items-center justify-center space-x-2 p-2 border rounded-lg hover:bg-gray-50"
              >
                <span>Giờ đi</span>
                {sortBy.field === "departureTime" ? (
                  sortBy.order === "asc" ? <FaSortAmountDown /> : <FaSortAmountUpAlt />
                ) : <FaSortAmountDown className="text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Routes Table */}
          <motion.div
            layout
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Nhà xe</th>
                  <th className="px-6 py-4 text-left">Điểm đi</th>
                  <th className="px-6 py-4 text-left">Điểm đến</th>
                  <th className="px-6 py-4 text-left">Giờ đi</th>
                  <th className="px-6 py-4 text-left">Giờ đến</th>
                  <th className="px-6 py-4 text-right">Giá vé</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedRoutes.map((route) => (
                  <React.Fragment key={route.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === route.id ? null : route.id)}
                    >
                      <td className="px-6 py-4">{route.transportName}</td>
                      <td className="px-6 py-4">{route.departure}</td>
                      <td className="px-6 py-4">{route.arrival}</td>
                      <td className="px-6 py-4">{new Date(route.departureTime).toLocaleString()}</td>
                      <td className="px-6 py-4">{new Date(route.arrivalTime).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">{route.price.toLocaleString()}đ</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(route);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit size={20} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(route.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={20} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                    {expandedRow === route.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50"
                      >
                        <td colSpan="7" className="px-6 py-4">
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-700">Điểm dừng</h3>
                            <div className="grid grid-cols-3 gap-4">
                              {route.stops.map((stop, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-4 rounded-lg shadow"
                                >
                                  <h4 className="font-medium text-blue-600">{stop.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{stop.address}</p>
                                  <p className="text-sm text-gray-500 mt-2">
                                    Giờ đến: {new Date(stop.arrivalTime).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
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

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                {editingRoute ? "Chỉnh sửa chuyến xe" : "Thêm chuyến xe mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Nhà xe</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      value={newRoute.transportName}
                      onChange={(e) => setNewRoute({ ...newRoute, transportName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Giá vé</label>
                    <input
                      type="number"
                      className="w-full p-3 border rounded-lg"
                      value={newRoute.price}
                      onChange={(e) => setNewRoute({ ...newRoute, price: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Điểm đi</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      value={newRoute.departure}
                      onChange={(e) => setNewRoute({ ...newRoute, departure: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Điểm đến</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      value={newRoute.arrival}
                      onChange={(e) => setNewRoute({ ...newRoute, arrival: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Giờ đi</label>
                    <DatePicker
                      selected={newRoute.departureTime}
                      onChange={(date) => setNewRoute({ ...newRoute, departureTime: date })}
                      showTimeSelect
                      dateFormat="Pp"
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Giờ đến</label>
                    <DatePicker
                      selected={newRoute.arrivalTime}
                      onChange={(date) => setNewRoute({ ...newRoute, arrivalTime: date })}
                      showTimeSelect
                      dateFormat="Pp"
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Stops Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Điểm dừng</h3>
                    <button
                      type="button"
                      onClick={handleAddStop}
                      className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <FaPlus />
                      <span>Thêm điểm dừng</span>
                    </button>
                  </div>
                  {newRoute.stops.map((stop, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg relative">
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <FaTimesCircle />
                      </button>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Tên điểm dừng</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg"
                          value={stop.name}
                          onChange={(e) => {
                            const newStops = [...newRoute.stops];
                            newStops[index].name = e.target.value;
                            setNewRoute({ ...newRoute, stops: newStops });
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Địa chỉ</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg"
                          value={stop.address}
                          onChange={(e) => {
                            const newStops = [...newRoute.stops];
                            newStops[index].address = e.target.value;
                            setNewRoute({ ...newRoute, stops: newStops });
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Giờ đến</label>
                        <DatePicker
                          selected={new Date(stop.arrivalTime)}
                          onChange={(date) => {
                            const newStops = [...newRoute.stops];
                            newStops[index].arrivalTime = date;
                            setNewRoute({ ...newRoute, stops: newStops });
                          }}
                          showTimeSelect
                          dateFormat="Pp"
                          className="w-full p-3 border rounded-lg"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    {editingRoute ? "Cập nhật" : "Thêm"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminRoutes;
