"use client";

import React, { useState, useCallback } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { FaFilePdf, FaFileDownload, FaHome, FaBus, FaRoute, FaFileInvoice, FaSignOutAlt, FaUsers, FaChevronLeft, FaSearch, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";

const AdminTransport = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("transport");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [transportData, setTransportData] = useState([
    {
      id: 1,
      name: "Phương Trang",
      type: "Giường nằm",
      seats: 40,
      amenities: "WiFi, TV, Điều hòa, Nước uống"
    },
    {
      id: 2,
      name: "Thành Bưởi",
      type: "Ghế ngồi",
      seats: 29,
      amenities: "WiFi, Điều hòa"
    },
    {
      id: 3,
      name: "Trung Nguyên",
      type: "Limousine",
      seats: 22,
      amenities: "WiFi, TV, Điều hòa, Nước uống, Snack"
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState(null);
  const [newTransport, setNewTransport] = useState({
    name: "",
    type: "",
    seats: "",
    amenities: ""
  });

  const onDrop = useCallback((acceptedFiles) => {
    // Handle file upload logic here
   // setUploadProgress(100); // Simulate upload completion
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const sidebarItems = [
    { id: "home", label: "Trang chủ", icon: <FaHome /> },
    { id: "transport", label: "Nhà xe", icon: <FaBus /> },
    { id: "routes", label: "Chuyến xe", icon: <FaRoute /> },
    { id: "promtions", label: "Ưu Đãi", icon: <FaFileInvoice /> },
    { id: "customers", label: "Khách Hàng", icon: <FaUsers /> },
    { id: "logout", label: "Đăng xuất", icon: <FaSignOutAlt /> }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTransport = transportData.filter(transport =>
    transport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    try {
      if (window.confirm("Bạn có chắc chắn muốn xóa nhà xe này?")) {
        setTransportData(transportData.filter(transport => transport.id !== id));
        showNotification("Xóa nhà xe thành công!", "success");
      }
    } catch (error) {
      showNotification(`Xóa nhà xe thất bại: ${error.message}`, "error");
    }
  };

  const handleEdit = (transport) => {
    setEditingTransport(transport);
    setNewTransport(transport);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTransport(null);
    setNewTransport({
      name: "",
      type: "",
      seats: "",
      amenities: ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingTransport) {
        setTransportData(transportData.map(transport =>
          transport.id === editingTransport.id ? { ...transport, ...newTransport, name: transport.name } : transport
        ));
        showNotification("Cập nhật nhà xe thành công!", "success");
      } else {
        setTransportData([...transportData, { ...newTransport, id: transportData.length + 1 }]);
        showNotification("Thêm nhà xe mới thành công!", "success");
      }
      setIsModalOpen(false);
    } catch (error) {
      showNotification(`Thao tác thất bại: ${error.message}`, "error");
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">Quản lý nhà xe</h1>
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
              <span>Thêm nhà xe</span>
            </motion.button>
            </div>
            
          </div>

          {/* Search Bar */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="mb-6 relative"
          >
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
          </motion.div>

          {/* Transport Table */}
          <motion.div
            layout
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Tên nhà xe</th>
                  <th className="px-6 py-4 text-left">Loại xe</th>
                  <th className="px-6 py-4 text-left">Số ghế</th>
                  <th className="px-6 py-4 text-left">Tiện ích</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredTransport.map((transport) => (
                    <motion.tr
                      key={transport.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{transport.name}</td>
                      <td className="px-6 py-4">{transport.type}</td>
                      <td className="px-6 py-4">{transport.seats}</td>
                      <td className="px-6 py-4">{transport.amenities}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(transport)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit size={20} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(transport.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={20} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border-t-4 border-blue-500"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                {editingTransport ? "Chỉnh sửa nhà xe" : "Thêm nhà xe mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Tên nhà xe</label>
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-lg transition-all duration-300 ${editingTransport ? "bg-gray-100" : ""} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    value={newTransport.name}
                    onChange={(e) => setNewTransport({ ...newTransport, name: e.target.value })}
                    disabled={editingTransport}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Loại xe</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTransport.type}
                    onChange={(e) => setNewTransport({ ...newTransport, type: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Số ghế</label>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTransport.seats}
                    onChange={(e) => setNewTransport({ ...newTransport, seats: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Tiện ích</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTransport.amenities}
                    onChange={(e) => setNewTransport({ ...newTransport, amenities: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-8">

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium"
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    {editingTransport ? "Cập nhật" : "Thêm"}
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

export default AdminTransport;