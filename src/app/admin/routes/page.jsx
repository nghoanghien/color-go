"use client";


import React, { useState, useCallback, useEffect, useMemo } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";


import { FaFileDownload, FaFilePdf, FaHome, FaBus, FaRoute, FaFileInvoice, FaSignOutAlt, FaUsers, FaChevronLeft, FaSearch, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaSortAmountDown, FaSortAmountUpAlt, FaGift, FaUserCircle, FaTicketAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingOverlay from "@/components/loading-overlay";
import { addRoute, deleteRoute, fetchRoute, updateRoute } from "@/services/routes";
import { convertDatetimeLocalToFirestoreTimestamp, convertTimestampToDatetimeLocal, formatDate, formatFirestoreTimestampToStandard, formatTimestampToDate, timeString } from "@/utils/time-manipulation";
import { exportToExcel, exportToPDF, formatDataForExport } from "@/utils/exportPDF";
import { fetchCoachCompanies } from "@/services/coachCompany";


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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  const [fileName, setFileName] = useState("DanhSachChuyenXe");
  const [sheetName, setSheetName] = useState("Chuyến xe");
  const [title, setTitle] = useState("Danh sách chuyến xe");
  const [fieldsToExclude, setFieldsToExclude] = useState("id, bookSeats, stops");
  const [desiredColumnOrder, setDesiredColumnOrder] = useState([
    "name",
    "departureLocation",
    "arrivalLocation",
    "departureTime",
    "arrivalTime",
    "price"
  ])
 
  const [routesData, setRoutesData] = useState();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [newRoute, setNewRoute] = useState({
    name: "",
    departureLocation: "",
    arrivalLocation: "",
    departureTime: new Date(),
    arrivalTime: new Date(),
    price: "",
    stops: []
  });

  const [availableCoachCompanies, setAvailableCoachCompanies] = useState([]);


  const locations = ["TP.HCM", "Hà Nội", "Đà Lạt", "Sapa", "Đà Nẵng", "Nha Trang"];
  const provinces = [
    "TP. Hồ Chí Minh", "Hà Nội",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh",
    "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
    "Cao Bằng", "Cần Thơ", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai",
    "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương",
    "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang",
    "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
    "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam",
    "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình",
    "Thái Nguyên", "Thanh Hóa", "Thừa Thiên - Huế", "Tiền Giang",
    "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
  ];
  

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
    { id: "tickets", label: "Vé xe", icon: <FaTicketAlt /> },
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


  const handleDelete = async (id) => {
    try {
      if (window.confirm("Bạn có chắc chắn muốn xóa chuyến xe này?")) {
        await deleteRoute(id);

        setRoutesData(routesData.filter(route => route.id !== id));
        showNotification("Xóa chuyến xe thành công!", "success");
      }
    } catch (error) {
      showNotification(`Xóa chuyến xe thất bại: ${error.message}`, "error");
    }
  };


  const handleEdit = (route) => {
    setEditingRoute(route);
    setNewRoute(route);
    setIsModalOpen(true);
  };


  const handleAdd = () => {
    setEditingRoute(null);
    const now = new Date();
    now.toISOString();
    now.toISOString();
    setNewRoute({
      name: "",
      departureLocation: "",
      arrivalLocation: "",
      departureTime: convertDatetimeLocalToFirestoreTimestamp(now),
      arrivalTime: convertDatetimeLocalToFirestoreTimestamp(now),
      price: "",
      stops: []
    });
    setIsModalOpen(true);
  };


  const handleAddStop = () => {
    const now = new Date();
    now.toISOString();
    setNewRoute(prev => ({
      ...prev,
      stops: [...prev.stops, { stop: "", address: "", datetime: convertDatetimeLocalToFirestoreTimestamp(now) }]
    }));
  };


  const handleRemoveStop = (index) => {
    setNewRoute(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await updateRoute(newRoute);

        setRoutesData(routesData.map(route =>
          route.id === editingRoute.id ? { ...newRoute, id: route.id } : route
        ));
        showNotification("Cập nhật chuyến xe thành công!", "success");
      } else {
        const newId = await addRoute(newRoute);
        
        setRoutesData([...routesData, { ...newRoute, id: newId }]);
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




const filteredAndSortedRoutes = useMemo(() => {
  if (!routesData) return [];


  return routesData
    .filter(route => {
      return (
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filterDeparture || route.departureLocation === filterDeparture) &&
        (!filterArrival || route.arrivalLocation === filterArrival) &&
        (!startDate || new Date(route.departureTime.seconds * 1000) >= startDate) &&
        (!endDate || new Date(route.departureTime.seconds * 1000) <= endDate)
      );
    })
    .sort((a, b) => {
      if (!sortBy.field) return 0;


      let comparison = 0;
      switch (sortBy.field) {
        case "price":
          comparison = a.price - b.price;
          break;
        case "departureTime":
          comparison = a.departureTime - b.departureTime;
          break;
        default:
          comparison = 0;
      }
      return sortBy.order === "asc" ? comparison : -comparison;
    });
}, [routesData, searchTerm, filterDeparture, filterArrival, startDate, endDate, sortBy]);




    const fetchRoutesData = async () => {
      try {
        const fetchedRoute = await fetchRoute();
        setRoutesData(fetchedRoute);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error.message);
      }
    };

    const getAvailableCoachCompanies = async () => {
      const data = await fetchCoachCompanies();
      const coachCompanies = data.map((coachCompany) => coachCompany.name)
      setAvailableCoachCompanies(coachCompanies);
    }
 
    useEffect(() => {
      getAvailableCoachCompanies();
      fetchRoutesData();
    }, []);


    const handleExportToExcel = () => {
      const fieldsArray = fieldsToExclude.split(',').map(field => field.trim());
      const dataToExport = formatDataForExport(filteredAndSortedRoutes, desiredColumnOrder);
      exportToExcel(dataToExport, fileName, sheetName, fieldsArray);
    };
 
 
    const handleExportToPDF = () => {
      const fieldsArray = fieldsToExclude.split(',').map(field => field.trim());
      const dataToExport = formatDataForExport(filteredAndSortedRoutes, desiredColumnOrder);
      exportToPDF(dataToExport, fileName, fieldsArray, title);
     
    };


    return !routesData ? <LoadingOverlay isLoading /> : (
    <div className="min-h-screen w-full flex bg-gray-50 relative">
      {/* Rest of the component remains the same until the filters section */}
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-0 left-1/3 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === "success" ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-red-500 to-red-400"} text-white`}
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
                className={`shadow-md px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-400 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 font-medium ${
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
                className="shadow-md bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <FaFileDownload />
                <span>Xuất Excel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportToPDF}
                className="shadow-md bg-gradient-to-r from-red-700 to-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <FaFilePdf />
                <span>Xuất PDF</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="shadow-md bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
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
                className="p-3 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <select
                value={filterDeparture}
                onChange={(e) => setFilterDeparture(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white shadow-md transition duration-200 ease-in-out hover:border-blue-400"
                >
                <option value="">Điểm đi</option>
                {provinces.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>


              <select
                value={filterArrival}
                onChange={(e) => setFilterArrival(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white shadow-md transition duration-200 ease-in-out hover:border-blue-400"
                >
                <option value="">Điểm đến</option>
                {provinces.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>


              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Từ ngày (khởi hành)"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out"
                  dateFormat="dd/MM/yyyy"
                />
              </div>


              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date.setHours(23, 59, 59, 999))}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="Đến ngày (khởi hành)"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out"
                  dateFormat="dd/MM/yyyy"
                />
              </div>


              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSort("price")}
                className={`p-2 rounded-lg flex items-center justify-center space-x-2 ${sortBy.field === "price" ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white" : "bg-gray-200 text-gray-700"} transition-all duration-300`}
              >
                <span>Giá vé</span>
                {sortBy.field === "price" ? (
                  sortBy.order === "asc" ? <FaSortAmountUpAlt /> : <FaSortAmountDown />
                ) : <FaSortAmountDown className="text-gray-400" />}
              </motion.button>


              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSort("departureTime")}
                className={`p-2 rounded-lg flex items-center justify-center space-x-2 ${sortBy.field === "departureTime" ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white" : "bg-gray-200 text-gray-700"} transition-all duration-300`}
              >
                <span>Giờ đi</span>
                {sortBy.field === "departureTime" ? (
                  sortBy.order === "asc" ? <FaSortAmountUpAlt /> : <FaSortAmountDown />
                ) : <FaSortAmountDown className="text-gray-400" />}
              </motion.button>
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
                      <td className="px-6 py-4">{route.name}</td>
                      <td className="px-6 py-4">{route.departureLocation}</td>
                      <td className="px-6 py-4">{route.arrivalLocation}</td>
                      <td className="px-6 py-4">{timeString(route.departureTime) + ", " + formatDate(route.departureTime)}</td>
                      <td className="px-6 py-4">{timeString(route.arrivalTime) + ", " + formatDate(route.arrivalTime)}</td>
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
                              {route.stops.map((stopp, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-4 rounded-lg shadow"
                                >
                                  <h4 className="font-medium text-blue-600">{stopp.stop}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{stopp.address}</p>
                                  <p className="text-sm text-gray-500 mt-2">
                                    Giờ đến: {formatFirestoreTimestampToStandard(stopp.datetime)}
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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-40"
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
                    <>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg"
                        value={newRoute.name}
                        onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                        list="name-suggestions" // Kết nối với datalist
                        required
                      />

                      <datalist id="name-suggestions">
                        {availableCoachCompanies.map((value, index) => (
                          <option key={index} value={value} />
                        ))}
                      </datalist>
                    </>
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
                    <>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg"
                        value={newRoute.departureLocation}
                        onChange={(e) => setNewRoute({ ...newRoute, departureLocation: e.target.value })}
                        list="departure-locations" // Kết nối với datalist
                        required
                      />
                      
                      <datalist id="departure-locations">
                        {provinces.map((location, index) => (
                          <option key={index} value={location} />
                        ))}
                      </datalist>
                    </>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Điểm đến</label>
                    <>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg"
                        value={newRoute.arrivalLocation}
                        onChange={(e) => setNewRoute({ ...newRoute, arrivalLocation: e.target.value })}
                        list="arrival-locations" // Kết nối với datalist
                        required
                      />

                      <datalist id="arrival-locations">
                        {provinces.map((location, index) => (
                          <option key={index} value={location} />
                        ))}
                      </datalist>
                    </>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Giờ đi</label>
                    <input
                      type="datetime-local"
                      value={convertTimestampToDatetimeLocal(newRoute.departureTime)}
                      onChange={(e) => setNewRoute({ ...newRoute, departureTime: convertDatetimeLocalToFirestoreTimestamp(e.target.value) })}
                      className="w-full p-3 border rounded-lg"
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Giờ đến</label>
                    <input
                      type="datetime-local"
                      value={convertTimestampToDatetimeLocal(newRoute.arrivalTime)}
                      onChange={(e) => setNewRoute({ ...newRoute, arrivalTime: convertDatetimeLocalToFirestoreTimestamp(e.target.value) })}
                      className="w-full p-3 border rounded-lg"
                      min={new Date().toISOString().slice(0, 16)}
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
                  {newRoute.stops.map((stopp, index) => (
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
                          value={stopp.stop}
                          onChange={(e) => {
                            const newStops = [...newRoute.stops];
                            newStops[index].stop = e.target.value;
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
                          value={stopp.address}
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
                        <input
                          type="datetime-local"
                          value={convertTimestampToDatetimeLocal(stopp.datetime)}
                          onChange={(e) => {
                            const newStops = [...newRoute.stops];
                            newStops[index].datetime = convertDatetimeLocalToFirestoreTimestamp(e.target.value);
                            setNewRoute({ ...newRoute, stops: newStops });
                          }}
                          className="w-full p-3 border rounded-lg"
                          min={new Date().toISOString().slice(0, 16)}
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
