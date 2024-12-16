'use client'; 

import React, { useState, useCallback } from "react";
import { FiUploadCloud } from "react-icons/fi";

import { FaFileDownload, FaFilePdf, FaHome, FaBus, FaRoute, FaFileInvoice, FaSignOutAlt, FaUsers, FaChevronLeft, FaSearch, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaSort, FaPercentage, FaDollarSign, FaSortAmountDown, FaSortAmountUp, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";


const AdminPromotions = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("promotions");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [filters, setFilters] = useState({
    percentage: false,
    amount: false,
    sortValue: null,
    sortDate: null
  });

  const [promotionsData, setPromotionsData] = useState([
    {
      id: 1,
      code: "SUMMER2023",
      description: "Giảm giá mùa hè",
      minOrder: 500000,
      maxDiscount: 200000,
      expiry: "2024-07-31 23:59:59",
      value: "20%",
      type: "percentage"
    },
    {
      id: 2,
      code: "NEWYEAR50K",
      description: "Ưu đãi năm mới",
      minOrder: 200000,
      maxDiscount: 50000,
      expiry: "2024-02-29 23:59:59",
      value: "50000",
      type: "amount"
    },
    {
      id: 3,
      code: "TET2024",
      description: "Khuyến mãi tết",
      minOrder: 1000000,
      maxDiscount: 500000,
      expiry: "2024-02-15 23:59:59",
      value: "30%",
      type: "percentage"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [newPromotion, setNewPromotion] = useState({
    code: "",
    description: "",
    minOrder: "",
    maxDiscount: "",
    expiry: "",
    value: "",
    type: "percentage"
  });

  const sidebarItems = [
    { id: "home", label: "Trang chủ", icon: <FaHome /> },
    { id: "transport", label: "Nhà xe", icon: <FaBus /> },
    { id: "routes", label: "Chuyến xe", icon: <FaRoute /> },
    { id: "promotions", label: "Ưu đãi", icon: <FaFileInvoice /> },
    { id: "customers", label: "Khách Hàng", icon: <FaUsers /> },
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

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterToggle = (filterType) => {
    if (filterType === "percentage" || filterType === "amount") {
      setFilters(prev => ({ ...prev, [filterType]: !prev[filterType] }));
    } else if (filterType === "value") {
      setFilters(prev => ({
        ...prev,
        sortValue: prev.sortValue === "asc" ? "desc" : "asc",
        sortDate: null
      }));
    } else if (filterType === "date") {
      setFilters(prev => ({
        ...prev,
        sortDate: prev.sortDate === "asc" ? "desc" : "asc",
        sortValue: null
      }));
    }
  };

  const filteredAndSortedPromotions = () => {
    let result = [...promotionsData];
    result = result.filter(promo =>
      promo.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filters.percentage && !filters.amount) {
      result = result.filter(promo => promo.type === "percentage");
    } else if (!filters.percentage && filters.amount) {
      result = result.filter(promo => promo.type === "amount");
    }
    if (filters.sortValue) {
      result.sort((a, b) => {
        const valueA = parseFloat(a.value);
        const valueB = parseFloat(b.value);
        return filters.sortValue === "asc" ? valueA - valueB : valueB - valueA;
      });
    }
    if (filters.sortDate) {
      result.sort((a, b) => {
        const dateA = new Date(a.expiry);
        const dateB = new Date(b.expiry);
        return filters.sortDate === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    return result;
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ưu đãi này?")) {
      setPromotionsData(prev => prev.filter(promo => promo.id !== id));
      showNotification("Xóa ưu đãi thành công!", "success");
    }
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setNewPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPromotion(null);
    setNewPromotion({
      code: "",
      description: "",
      minOrder: "",
      maxDiscount: "",
      expiry: "",
      value: "",
      type: "percentage"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingPromotion) {
        setPromotionsData(prev =>
          prev.map(promo =>
            promo.id === editingPromotion.id ? { ...newPromotion, id: promo.id } : promo
          )
        );
        showNotification("Cập nhật ưu đãi thành công!", "success");
      } else {
        setPromotionsData(prev => [
          ...prev,
          { ...newPromotion, id: prev.length + 1 }
        ]);
        showNotification("Thêm ưu đãi mới thành công!", "success");
      }
      setIsModalOpen(false);
    } catch (error) {
      showNotification("Có lỗi xảy ra!", "error");
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
            {notification.type === "success" ? <FaCheckCircle className="text-xl" /> : <FaTimesCircle className="text-xl" />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
            <motion.div animate={{ rotate: isSidebarCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
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

      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Quản lý ưu đãi</h1>
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
              <span>Thêm ưu đãi</span>
            </motion.button>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo mã..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterToggle("percentage")}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filters.percentage ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white" : "bg-gray-200 text-gray-700"} transition-all duration-300`}
              >
                <FaPercentage />
                <span>Giảm theo %</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterToggle("amount")}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filters.amount ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white" : "bg-gray-200 text-gray-700"} transition-all duration-300`}
              >
                <FaDollarSign />
                <span>Giảm theo tiền</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterToggle("value")}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filters.sortValue ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white" : "bg-gray-200 text-gray-700"} transition-all duration-300`}
              >
                {filters.sortValue === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
                <span>Giá trị giảm</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterToggle("date")}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filters.sortDate ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white" : "bg-gray-200 text-gray-700"} transition-all duration-300`}
              >
                <FaCalendarAlt />
                <span>Hạn sử dụng</span>
              </motion.button>
            </div>
          </div>

          <motion.div layout className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Mã</th>
                  <th className="px-6 py-4 text-left">Nội dung</th>
                  <th className="px-6 py-4 text-left">Đơn tối thiểu</th>
                  <th className="px-6 py-4 text-left">Giảm tối đa</th>
                  <th className="px-6 py-4 text-left">Giá trị giảm</th>
                  <th className="px-6 py-4 text-left">Hạn sử dụng</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAndSortedPromotions().map((promotion) => (
                    <motion.tr
                      key={promotion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{promotion.code}</td>
                      <td className="px-6 py-4">{promotion.description}</td>
                      <td className="px-6 py-4">{promotion.minOrder.toLocaleString()}đ</td>
                      <td className="px-6 py-4">{promotion.maxDiscount.toLocaleString()}đ</td>
                      <td className="px-6 py-4">{promotion.value}</td>
                      <td className="px-6 py-4">{new Date(promotion.expiry).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(promotion)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit size={20} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(promotion.id)}
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
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">
                {editingPromotion ? "Chỉnh sửa ưu đãi" : "Thêm ưu đãi mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Mã ưu đãi</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newPromotion.code}
                    onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Nội dung</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Đơn tối thiểu (đ)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    value={newPromotion.minOrder}
                    onChange={(e) => setNewPromotion({ ...newPromotion, minOrder: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Giảm tối đa (đ)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    value={newPromotion.maxDiscount}
                    onChange={(e) => setNewPromotion({ ...newPromotion, maxDiscount: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Loại giảm giá</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={newPromotion.type}
                    onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value })}
                    required
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="amount">Số tiền cố định</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Giá trị giảm</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newPromotion.value}
                    onChange={(e) => setNewPromotion({ ...newPromotion, value: e.target.value })}
                    placeholder={newPromotion.type === "percentage" ? "Ví dụ: 20%" : "Ví dụ: 50000"}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Hạn sử dụng</label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded-lg"
                    value={newPromotion.expiry}
                    onChange={(e) => setNewPromotion({ ...newPromotion, expiry: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingPromotion ? "Cập nhật" : "Thêm"}
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

export default AdminPromotions;