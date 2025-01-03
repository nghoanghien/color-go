"use client";

import React, { useState, useEffect } from "react";
import {
	FaHome,
	FaBus,
	FaRoute,
	FaGift,
	FaUsers,
	FaUserCircle,
	FaSignOutAlt,
	FaChevronLeft,
	FaEdit,
	FaCheckCircle,
	FaTimesCircle,
	FaTicketAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";
import {
	fetchAdminData,
	getDetailAdmin,
	updateAdminInfo,
} from "../../../../services/admin";

import LoadingOverlay from "@/components/loading-overlay";
import { useAdminUser } from "@/hooks/useAdminUser";
import { convertTimestampToDatetimeLocalWithoutTime } from "@/utils/time-manipulation";
import { Timestamp } from "firebase/firestore";
import PendingOverlay from "@/components/pending-overlay";
import CustomDatePicker from "@/components/CustomDatePicker";

const AdminAccount = () => {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const adminUser = useAdminUser();

	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [activeTab, setActiveTab] = useState("account");
	const [isEditing, setIsEditing] = useState(false);
	const [notification, setNotification] = useState({
		show: false,
		message: "",
		type: "",
	});

	const [adminData, setAdminData] = useState();

	const [editedData, setEditedData] = useState(adminData);

	const sidebarItems = [
		{ id: "dashboard", label: "Trang chủ", icon: <FaHome /> },
		{ id: "coach-company", label: "Nhà xe", icon: <FaBus /> },
		{ id: "routes", label: "Chuyến xe", icon: <FaRoute /> },
		{ id: "promotions", label: "Ưu Đãi", icon: <FaGift /> },
		{ id: "customers", label: "Khách Hàng", icon: <FaUsers /> },
		{ id: "tickets", label: "Vé xe", icon: <FaTicketAlt /> },
		{ id: "account", label: "Tài khoản", icon: <FaUserCircle /> },
		{ id: "logout", label: "Đăng xuất", icon: <FaSignOutAlt /> },
	];

	const showNotification = (message, type) => {
		setNotification({ show: true, message, type });
		setTimeout(
			() => setNotification({ show: false, message: "", type: "" }),
			3000
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsPending(true);
		await updateAdminInfo(editedData);
		setIsPending(false);

		setAdminData(editedData);
		setIsEditing(false);
		showNotification("Cập nhật thông tin thành công!", "success");
	};

	const handleCancel = () => {
		setEditedData(adminData);
		setIsEditing(false);
	};

	const handleNavigate = (tab) => {
		setIsPending(true);
		setActiveTab(tab);
		if (tab !== "logout") {
			router.replace(`/admin/${tab}`);
		} else {
			router.replace("/admin/admin-login");
		}
	};

	useEffect(() => {
		(async () => {
			const adminData = await getDetailAdmin(adminUser.id);
			setAdminData(adminData);
			setEditedData(adminData);
			localStorage.setItem("admin-user", JSON.stringify(adminData));
		})();
	}, []);

	return !adminData ? (
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
        className="rounded-tr-3xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 space-y-2 relative"
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
          className="max-w-3xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 drop-shadow-md">
              Thông tin tài khoản
            </h1>
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="shadow-md bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <FaEdit />
                <span>Chỉnh sửa</span>
              </motion.button>
            )}
          </div>

          <motion.div
            layout
            className="border border-gray-200 bg-white rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Tên</label>
                  <input
                    type="text"
                    className={`w-full p-3 rounded-2xl border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full transition-shadow duration-200 ease-in-out ${
                      isEditing
                        ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    value={editedData.name}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        name: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className={`w-full p-3 rounded-2xl border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full transition-shadow duration-200 ease-in-out ${
                      isEditing
                        ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    value={editedData.phone}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        phone: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Địa chỉ</label>
                  <input
                    type="text"
                    className={`w-full p-3 rounded-2xl border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full transition-shadow duration-200 ease-in-out ${
                      isEditing
                        ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    value={editedData.address}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        address: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 rounded-2xl border-2 border-gray-200 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full transition-shadow duration-200 ease-in-out bg-gray-50"
                    value={editedData.email}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Ngày sinh</label>
                  <CustomDatePicker
                    type="date"
                    className={`w-full p-3 rounded-2xl border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none w-full transition-shadow duration-200 ease-in-out ${
                      isEditing
                        ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    value={
                      convertTimestampToDatetimeLocalWithoutTime(
                        editedData.birth
                      ) || ""
                    }
                    onChange={(dateString) => {
                      // Tạo Date object từ ISO string với thời gian là 12:00 trưa để tránh vấn đề về múi giờ
                      const localDate = new Date(dateString + "T24:00:00");
											console.log(localDate);

                      // Tạo timestamp từ localDate
                      const newBirthDate = new Timestamp(
                        localDate.getTime() / 1000,
                        0
                      );

                      console.log("New Birth Date (timestamp):", newBirthDate);
                      setEditedData({
                        ...editedData,
                        birth: newBirthDate,
                      });
                    }}
                    disabled={!isEditing}
                    isEditing={isEditing}
                    required={true}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Giới tính</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Nam"
                        checked={editedData.sex === "Nam"}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            sex: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span>Nam</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Nữ"
                        checked={editedData.sex === "Nữ"}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            sex: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span>Nữ</span>
                    </label>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="shadow-md px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Lưu thay đổi
                  </motion.button>
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAccount;
