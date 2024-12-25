'use client';


import React, { useState, useCallback, useEffect } from "react";
import { FiUploadCloud } from "react-icons/fi";


import { FaFileDownload, FaFilePdf, FaHome, FaBus, FaRoute, FaFileInvoice, FaSignOutAlt, FaUsers, FaChevronLeft, FaSearch, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaSort, FaPercentage, FaDollarSign, FaSortAmountDown, FaSortAmountUp, FaCalendarAlt, FaGift, FaUserCircle, FaTicketAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";


import { useRouter } from "next/navigation";
import { addPromotion, deletePromotion, fetchPromotion, updatePromotion } from "@/services/promotion";


import LoadingOverlay from "@/components/loading-overlay";
import { exportToExcel, exportToPDF, formatDataForExport } from "@/utils/exportPDF";
import { convertDatetimeLocalToFirestoreTimestamp, convertTimestampToDatetimeLocal, formatDate, formatFirestoreTimestampToStandard, formatTimestampToCustom, formatTimestampToDate, timeString } from "@/utils/time-manipulation";
import { hasRequiredProperties, readExcelFile } from "@/utils/import-export";
import PendingOverlay from "@/components/pending-overlay";
import CustomDateTimePicker from "../../../../components/CustomDatetimePicker";


const AdminPromotions = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);


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


  const [promotionsData, setPromotionsData] = useState();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [newPromotion, setNewPromotion] = useState({
    code: "",
    title: "",
    minApply: "",
    max: "",
    expiry: "",
    value: "",
    type: "percentage"
  });


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
  const [fileName, setFileName] = useState("DanhSanhMaGiamGia");
  const [sheetName, setSheetName] = useState("Mã giảm giá");
  const [title, setTitle] = useState("Danh sách mã giảm giá");
  const [fieldsToExclude, setFieldsToExclude] = useState("id");
  const [desiredColumnOrder, setDesiredColumnOrder] = useState([
    "code",
    "title",
    "minApply",
    "max",
    "value",
    "valid"
  ])


  const onDrop = useCallback(async (acceptedFiles) => {
    setIsPending(true);
    const data = await readExcelFile(acceptedFiles);
    const requiredProps = ["code", "title", "minApply", "max", "value", "valid"];

    try {
      // File không có dữ liệu
      try {
        if (data.length === 0) {
          throw new Error("Lỗi đọc file: File tải lên không có dữ liệu");
        }
      } catch (error) {
        throw new Error(error.message);
      }

      try {
        if (!hasRequiredProperties(data[0], requiredProps)) {
          throw new Error(`Lỗi đọc file: File cần có đủ các cột (${requiredProps.join(", ")})`);
        }
      } catch (error) {
        throw new Error(error.message);
      }

      for (let index = 0; index < data.length; index++) {
        try {
          data[index].valid = convertDatetimeLocalToFirestoreTimestamp(data[index].valid);
          const newId = await addPromotion(data[index]);

          setPromotionsData(prev => [
            ...prev,
            { ...data[index], id: newId }
          ]);        
        } catch (error) {
          throw new Error(`Lỗi dòng dữ liệu (${index + 1}): ${error.message}`);
        }
      }
      setIsPending(false);
      showNotification("Tải dữ liệu trong file thành công!", "success");
    } catch (error) {
      setIsPending(false);
      showNotification(`${error.message}`, "error");
    }
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
      result = result.filter(promo => promo.type === 1);
    } else if (!filters.percentage && filters.amount) {
      result = result.filter(promo => promo.type === 0);
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
        const dateA = a.valid;
        const dateB = b.valid;
        return filters.sortDate === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    return result;
  };


  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ưu đãi này?")) {
      setIsPending(true);
      await deletePromotion(id);
      setIsPending(false);


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
    const now = new Date();
    now.toISOString();
    setNewPromotion({
      code: "",
      title: "",
      minApply: "",
      max: "",
      valid: convertDatetimeLocalToFirestoreTimestamp(now),
      value: "",
      type: 1
    });
    setIsModalOpen(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      if (editingPromotion) {
        await updatePromotion(newPromotion);
        setIsPending(false);

        setPromotionsData(prev =>
          prev.map(promo =>
            promo.id === editingPromotion.id ? { ...newPromotion, id: promo.id } : promo
          )
        );
        showNotification("Cập nhật ưu đãi thành công!", "success");
      } else {
        const newId = await addPromotion(newPromotion);
        setIsPending(false);

        setPromotionsData(prev => [
          ...prev,
          { ...newPromotion, id: newId }
        ]);
        showNotification("Thêm ưu đãi mới thành công!", "success");
      }
      setIsModalOpen(false);
    } catch (error) {
      setIsPending(false);
      showNotification(`Thao tác thất bại: ${error.message}`, "error");
    }
  };


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


  const fetchPromotionsData = async () => {
    try {
      const fetchedPromotion = await fetchPromotion();
      console.log("Dữ liệu lấy được từ fetchCoachCompanies:", fetchedPromotion);
      setPromotionsData(fetchedPromotion);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error.message);
    }
  };


  useEffect(() => {
    fetchPromotionsData();
  }, []);


  const handleExportToExcel = () => {
    const fieldsArray = fieldsToExclude.split(',').map(field => field.trim());
    const dataToExport = formatDataForExport(filteredAndSortedPromotions(), desiredColumnOrder);
    exportToExcel(dataToExport, fileName, sheetName, fieldsArray);
  };




  const handleExportToPDF = () => {
    const fieldsArray = fieldsToExclude.split(',').map(field => field.trim());
    const dataToExport = formatDataForExport(filteredAndSortedPromotions(), desiredColumnOrder);
    exportToPDF(dataToExport, fileName, fieldsArray, title);
   
  };


  return !promotionsData ? (
    <LoadingOverlay isLoading />
  ) : (
    <div className="min-h-screen w-full flex bg-gray-50 relative">
      <PendingOverlay isLoading={isPending} />

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

      <motion.div
        initial={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        animate={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`rounded-tr-3xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 space-y-2 relative sticky top-0 left-0 h-screen`}
      >
        <div className="mb-8 text-center relative">
          <motion.h2
            initial={{ opacity: isSidebarCollapsed ? 0 : 1 }}
            animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
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
            className={`w-full flex items-center ${
              isSidebarCollapsed ? "justify-center" : "space-x-3"
            } px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? "bg-white/20 shadow-lg"
                : "hover:bg-white/10"
            }`}
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
                className={`shadow-md px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-400 text-white rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all duration-300 font-medium ${
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
                onClick={handleExportToExcel}
                className="shadow-md bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <FaFileDownload />
                <span>Xuất Excel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportToPDF}
                className="shadow-md bg-gradient-to-r from-red-700 to-red-500 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <FaFilePdf />
                <span>Xuất PDF</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="shadow-md bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
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
                className="p-3 pl-9 rounded-2xl shadow-lg border-4 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:outline-none w-full shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterToggle("percentage")}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 ${
                  filters.percentage
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                    : "bg-gray-200 text-gray-700"
                } transition-all duration-300`}
              >
                <FaPercentage />
                <span>Giảm theo %</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterToggle("amount")}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 ${
                  filters.amount
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                    : "bg-gray-200 text-gray-700"
                } transition-all duration-300`}
              >
                <FaDollarSign />
                <span>Giảm theo tiền</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterToggle("value")}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 ${
                  filters.sortValue
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                    : "bg-gray-200 text-gray-700"
                } transition-all duration-300`}
              >
                {filters.sortValue === "asc" ? (
                  <FaSortAmountUp />
                ) : (
                  <FaSortAmountDown />
                )}
                <span>Giá trị giảm</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterToggle("date")}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 ${
                  filters.sortDate
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                    : "bg-gray-200 text-gray-700"
                } transition-all duration-300`}
              >
                {filters.sortDate === "asc" ? (
                  <FaSortAmountUp />
                ) : (
                  <FaSortAmountDown />
                )}
                <span>Hạn sử dụng</span>
              </motion.button>
            </div>
          </div>

          <motion.div
            layout
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
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
                      <td className="px-6 py-4">{promotion.title}</td>
                      <td className="px-6 py-4">
                        {promotion.minApply.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4">
                        {promotion.max.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4">
                        {promotion.value.toLocaleString()}
                        {promotion.type === 1 ? "%" : "đ"}
                      </td>
                      <td className="px-6 py-4">
                        {formatFirestoreTimestampToStandard(promotion.valid)}
                      </td>
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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-8 border-blue-100 rounded-2xl p-8 w-full max-w-3xl shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">
                {editingPromotion ? "Chỉnh sửa ưu đãi" : "Thêm ưu đãi mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Mã ưu đãi
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập mã ưu đãi..."
                      className={`w-full p-3 rounded-2xl shadow-md border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full hover:shadow-lg transition-shadow duration-200 ease-in-out ${
                        editingPromotion ? "bg-gray-100" : ""
                      }`}
                      value={newPromotion.code}
                      onChange={(e) =>
                        setNewPromotion({
                          ...newPromotion,
                          code: e.target.value,
                        })
                      }
                      required
                      disabled={editingPromotion}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Nội dung</label>
                    <input
                      type="text"
                      placeholder="Nhập nội dung giảm giá..."
                      className="w-full p-3 rounded-2xl shadow-md border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full hover:shadow-lg transition-shadow duration-200 ease-in-out"
                      value={newPromotion.title}
                      onChange={(e) =>
                        setNewPromotion({
                          ...newPromotion,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Đơn tối thiểu (đ)
                    </label>
                    <input
                      type="number"
                      placeholder="Nhập giá trị đơn tối thiểu..."
                      className="w-full p-3 rounded-2xl shadow-md border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full hover:shadow-lg transition-shadow duration-200 ease-in-out"
                      value={newPromotion.minApply}
                      onChange={(e) =>
                        setNewPromotion({
                          ...newPromotion,
                          minApply: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Giảm tối đa (đ)
                    </label>
                    <input
                      type="number"
                      placeholder="Nhập mức giảm tối đa..."
                      className="w-full p-3 rounded-2xl shadow-md border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full hover:shadow-lg transition-shadow duration-200 ease-in-out"
                      value={newPromotion.max}
                      onChange={(e) =>
                        setNewPromotion({
                          ...newPromotion,
                          max: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Loại giảm giá
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={newPromotion.type}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        type: parseInt(e.target.value, 10),
                      })
                    }
                    required
                  >
                    <option value="1">Phần trăm (%)</option>
                    <option value="0">Số tiền cố định</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Giá trị giảm
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 rounded-2xl shadow-md border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full hover:shadow-lg transition-shadow duration-200 ease-in-out"
                    value={newPromotion.value}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        value: Number(e.target.value),
                      })
                    }
                    placeholder={
                      newPromotion.type === "percentage"
                        ? "Ví dụ: 20%"
                        : "Ví dụ: 50000đ"
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Hạn sử dụng
                  </label>
                  <CustomDateTimePicker
                    //type="datetime-local"
                    className="w-full p-3 rounded-2xl shadow-md border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full hover:shadow-lg transition-shadow duration-200 ease-in-out"
                    value={convertTimestampToDatetimeLocal(newPromotion.valid)}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        valid: convertDatetimeLocalToFirestoreTimestamp(e),
                      })
                    }
                    min={new Date().toISOString().slice(0, 16)}
                    //required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
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