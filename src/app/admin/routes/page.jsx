"use client";

import React, { useState } from "react";
import { FaHome, FaBus, FaRoute, FaFileInvoice, FaSignOutAlt, FaUsers, FaChevronLeft, FaSearch, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminRoutes = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("routes");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [filterOrigin, setFilterOrigin] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [sortType, setSortType] = useState("");

  const [routesData, setRoutesData] = useState([
    {
      id: 1,
      transportName: "Phương Trang",
      origin: "TP.HCM",
      destination: "Đà Lạt",
      departureTime: "2024-02-15T07:00:00",
      arrivalTime: "2024-02-15T14:00:00",
      price: 250000,
      stops: [
        { name: "Trạm Dầu Giây", address: "QL1A, Thống Nhất, Đồng Nai", arrivalTime: "2024-02-15T08:30:00" },
        { name: "Bảo Lộc", address: "QL20, Bảo Lộc, Lâm Đồng", arrivalTime: "2024-02-15T11:30:00" }
      ]
    },
    {
      id: 2,
      transportName: "Thành Bưởi",
      origin: "TP.HCM",
      destination: "Nha Trang",
      departureTime: "2024-02-15T20:00:00",
      arrivalTime: "2024-02-16T04:00:00",
      price: 280000,
      stops: [
        { name: "Phan Thiết", address: "QL1A, Phan Thiết, Bình Thuận", arrivalTime: "2024-02-15T23:30:00" },
        { name: "Cam Ranh", address: "QL1A, Cam Ranh, Khánh Hòa", arrivalTime: "2024-02-16T02:30:00" }
      ]
    }
  ]);

  const [newRoute, setNewRoute] = useState({
    transportName: "",
    origin: "",
    destination: "",
    departureTime: new Date(),
    arrivalTime: new Date(),
    price: "",
    stops: []
  });

  const locations = ["TP.HCM", "Đà Lạt", "Nha Trang", "Đà Nẵng", "Hà Nội", "Cần Thơ"];

  const sidebarItems = [
    { id: "home", label: "Trang chủ", icon: <FaHome /> },
    { id: "transport", label: "Nhà xe", icon: <FaBus /> },
    { id: "routes", label: "Chuyến xe", icon: <FaRoute /> },
    { id: "invoices", label: "Hóa Đơn", icon: <FaFileInvoice /> },
    { id: "customers", label: "Khách Hàng", icon: <FaUsers /> },
    { id: "logout", label: "Đăng xuất", icon: <FaSignOutAlt /> }
  ];

  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [newStop, setNewStop] = useState({
    name: "",
    address: "",
    arrivalTime: new Date()
  });

  const handleDeleteStop = (routeId, stopId) => {
    setRoutesData(routesData.map(route => {
      if (route.id === routeId) {
        return {
          ...route,
          stops: route.stops.filter(stop => stop.id !== stopId)
        };
      }
      return route;
    }));
    showNotification("Xóa điểm dừng thành công!", "success");
  };
  
  const handleEditStop = (routeId, stop) => {
    setEditingStop({ routeId, ...stop });
    setNewStop(stop);
    setIsStopModalOpen(true);
  };
  
  const handleSubmitStop = (e) => {
    e.preventDefault();
    if (editingStop) {
      setRoutesData(routesData.map(route => {
        if (route.id === editingStop.routeId) {
          return {
            ...route,
            stops: route.stops.map(stop =>
              stop.id === editingStop.id ? { ...stop, ...newStop } : stop
            )
          };
        }
        return route;
      }));
      showNotification("Cập nhật điểm dừng thành công!", "success");
    } else {
      const routeToUpdate = routesData.find(route => route.id === expandedRoute);
      if (routeToUpdate) {
        const newStopWithId = { ...newStop, id: routeToUpdate.stops.length + 1 };
        setRoutesData(routesData.map(route => {
          if (route.id === expandedRoute) {
            return {
              ...route,
              stops: [...route.stops, newStopWithId]
            };
          }
          return route;
        }));
        showNotification("Thêm điểm dừng thành công!", "success");
      }
    }
    setIsStopModalOpen(false);
  };


  const handleSort = (type) => {
    setSortType(type);
    let sortedData = [...routesData];

    switch(type) {
      case "price-asc":
        sortedData.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedData.sort((a, b) => b.price - a.price);
        break;
      case "time-asc":
        sortedData.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
        break;
      case "time-desc":
        sortedData.sort((a, b) => new Date(b.departureTime) - new Date(a.departureTime));
        break;
      default:
        break;
    }

    setRoutesData(sortedData);
  };

  const filteredRoutes = routesData.filter(route => {
    const matchesSearch = route.transportName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrigin = !filterOrigin || route.origin === filterOrigin;
    const matchesDestination = !filterDestination || route.destination === filterDestination;
    return matchesSearch && matchesOrigin && matchesDestination;
  });

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chuyến xe này?")) {
      setRoutesData(routesData.filter(route => route.id !== id));
      showNotification("Xóa chuyến xe thành công!", "success");
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
      origin: "",
      destination: "",
      departureTime: new Date(),
      arrivalTime: new Date(),
      price: "",
      stops: []
    });
    setIsModalOpen(true);
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

  

  return (
    <div className="min-h-screen w-full flex bg-gray-50 relative">
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === "success" ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-red-500 to-red-400"} text-white`}
          >
            {notification.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        animate={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 space-y-2 relative"
      >
        <div className="mb-8 text-center relative">
          <motion.h2
            initial={{ opacity: isSidebarCollapsed ? 0 : 1 }}
            animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
            className={`text-2xl font-bold ${isSidebarCollapsed ? "hidden" : "block"}`}
          >
            Quản trị viên
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 rounded-full p-1 shadow-lg"
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
            className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "space-x-3"} px-4 py-3 rounded-lg ${activeTab === item.id ? "bg-white/20" : "hover:bg-white/10"}`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isSidebarCollapsed && <span>{item.label}</span>}
          </motion.button>
        ))}
      </motion.div>

      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Quản lý chuyến xe</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <FaPlus />
              <span>Thêm chuyến xe</span>
            </motion.button>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên nhà xe..."
                className="pl-10 w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filterOrigin}
                onChange={(e) => setFilterOrigin(e.target.value)}
                className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Điểm đi</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                value={filterDestination}
                onChange={(e) => setFilterDestination(e.target.value)}
                className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Điểm đến</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <button
                onClick={() => handleSort(sortType === "price-asc" ? "price-desc" : "price-asc")}
                className="p-3 rounded-lg border hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <span>Giá vé</span>
                {sortType === "price-asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>

              <button
                onClick={() => handleSort(sortType === "time-asc" ? "time-desc" : "time-asc")}
                className="p-3 rounded-lg border hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <span>Giờ đi</span>
                {sortType === "time-asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>

          <motion.div layout className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Nhà xe</th>
                  <th className="px-6 py-4 text-left">Điểm đi</th>
                  <th className="px-6 py-4 text-left">Điểm đến</th>
                  <th className="px-6 py-4 text-left">Giờ đi</th>
                  <th className="px-6 py-4 text-left">Giờ đến</th>
                  <th className="px-6 py-4 text-left">Giá vé</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => (
                  <React.Fragment key={route.id}>
                    <tr
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                    >
                      <td className="px-6 py-4">{route.transportName}</td>
                      <td className="px-6 py-4">{route.origin}</td>
                      <td className="px-6 py-4">{route.destination}</td>
                      <td className="px-6 py-4">{formatDateTime(route.departureTime)}</td>
                      <td className="px-6 py-4">{formatDateTime(route.arrivalTime)}</td>
                      <td className="px-6 py-4">{formatPrice(route.price)}</td>
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
                    </tr>
                    {expandedRoute === route.id && (
                      <tr>
                        <td colSpan="7" className="bg-gray-50 px-6 py-4">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h3 className="font-bold mb-2">Điểm dừng:</h3>
                            <div className="space-y-2">
                              {route.stops.map((stop, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 p-2 rounded-lg bg-white">
                                  <div>{stop.name}</div>
                                  <div>{stop.address}</div>
                                  <div>{formatDateTime(stop.arrivalTime)}</div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-lg"
            >
              <h2 className="text-2xl font-bold mb-4">
                {editingRoute ? "Chỉnh sửa chuyến xe" : "Thêm chuyến xe mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">Nhà xe</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newRoute.transportName}
                    onChange={(e) => setNewRoute({ ...newRoute, transportName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Điểm đi</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newRoute.origin}
                      onChange={(e) => setNewRoute({ ...newRoute, origin: e.target.value })}
                      required
                    >
                      <option value="">Chọn điểm đi</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Điểm đến</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newRoute.destination}
                      onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
                      required
                    >
                      <option value="">Chọn điểm đến</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Giờ đi</label>
                    <DatePicker
                      selected={newRoute.departureTime}
                      onChange={(date) => setNewRoute({ ...newRoute, departureTime: date })}
                      showTimeSelect
                      dateFormat="Pp"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Giờ đến</label>
                    <DatePicker
                      selected={newRoute.arrivalTime}
                      onChange={(date) => setNewRoute({ ...newRoute, arrivalTime: date })}
                      showTimeSelect
                      dateFormat="Pp"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Giá vé</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={newRoute.price}
                    onChange={(e) => setNewRoute({ ...newRoute, price: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {editingRoute ? "Cập nhật" : "Thêm"}
                  </button>
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
