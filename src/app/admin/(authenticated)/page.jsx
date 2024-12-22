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

  // New state for stop management
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [newStop, setNewStop] = useState({
    name: "",
    address: "",
    arrivalTime: new Date()
  });

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
        { id: 1, name: "Trạm Dầu Giây", address: "QL1A, Thống Nhất, Đồng Nai", arrivalTime: "2024-02-15T08:30:00" },
        { id: 2, name: "Bảo Lộc", address: "QL20, Bảo Lộc, Lâm Đồng", arrivalTime: "2024-02-15T11:30:00" }
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
        { id: 1, name: "Phan Thiết", address: "QL1A, Phan Thiết, Bình Thuận", arrivalTime: "2024-02-15T23:30:00" },
        { id: 2, name: "Cam Ranh", address: "QL1A, Cam Ranh, Khánh Hòa", arrivalTime: "2024-02-16T02:30:00" }
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
    setNewStop({
      ...stop,
      arrivalTime: new Date(stop.arrivalTime)
    });
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
              stop.id === editingStop.id ? { 
                ...stop, 
                name: newStop.name, 
                address: newStop.address, 
                arrivalTime: newStop.arrivalTime.toISOString() 
              } : stop
            )
          };
        }
        return route;
      }));
      showNotification("Cập nhật điểm dừng thành công!", "success");
    } else {
      const routeToUpdate = routesData.find(route => route.id === expandedRoute);
      if (routeToUpdate) {
        const newStopWithId = { 
          id: routeToUpdate.stops.length + 1, 
          name: newStop.name, 
          address: newStop.address, 
          arrivalTime: newStop.arrivalTime.toISOString() 
        };
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

  // Existing render methods

  return (
    <div className="min-h-screen w-full flex bg-gray-50 relative">
      {/* ... previous render code ... */}
      
      
      {/* Route list rendering */}
      <motion.div layout className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
            {/* ... table headers ... */}
          </thead>
          <tbody>
            {filteredRoutes.map((route) => (
              <React.Fragment key={route.id}>
                <tr
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                >
                  {/* ... existing route row ... */}
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
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold">Điểm dừng:</h3>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditingStop(null);
                              setNewStop({
                                name: "",
                                address: "",
                                arrivalTime: new Date()
                              });
                              setIsStopModalOpen(true);
                            }}
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                          >
                            <FaPlus />
                            <span>Thêm điểm dừng</span>
                          </motion.button>
                        </div>
                        <div className="space-y-2">
                          {route.stops.map((stop) => (
                            <div key={stop.id} className="grid grid-cols-3 gap-4 p-2 rounded-lg bg-white items-center">
                              <div>{stop.name}</div>
                              <div>{stop.address}</div>
                              <div className="flex justify-between items-center">
                                {formatDateTime(stop.arrivalTime)}
                                <div className="space-x-2">
                                  <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleEditStop(route.id, stop)}
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <FaEdit size={20} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeleteStop(route.id, stop.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash size={20} />
                                  </motion.button>
                                </div>
                              </div>
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

      {/* Stop Modal */}
      <AnimatePresence>
        {isStopModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full"
            >
              <h2 className="text-2xl font-bold mb-4">
                {editingStop ? "Chỉnh sửa điểm dừng" : "Thêm điểm dừng mới"}
              </h2>
              <form onSubmit={handleSubmitStop}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên điểm dừng</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={newStop.name}
                      onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={newStop.address}
                      onChange={(e) => setNewStop({ ...newStop, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giờ đến</label>
                    <DatePicker
                      selected={newStop.arrivalTime}
                      onChange={(date) => setNewStop({ ...newStop, arrivalTime: date })}
                      showTimeSelect
                      dateFormat="Pp"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsStopModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {editingStop ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing modals and other components */}
    </div>
  );
};

export default AdminRoutes;