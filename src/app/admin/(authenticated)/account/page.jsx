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
import { fetchAdminData, updateAdminInfo } from "../../../../services/admin";

import LoadingOverlay from "@/components/loading-overlay";

const AdminAccount = () => {
	const router = useRouter();

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
		await updateAdminInfo(editedData);

		setAdminData(editedData);
		setIsEditing(false);
		showNotification("Cập nhật thông tin thành công!", "success");
	};

	const handleCancel = () => {
		setEditedData(adminData);
		setIsEditing(false);
	};

	const handleNavigate = (tab) => {
		setActiveTab(tab);
		if (tab !== "logout") {
			router.replace(`/admin/${tab}`);
		} else {
			router.replace("/admin/admin-login");
		}
	};

	useEffect(() => {
		const getAdminData = async () => {
			const data = await fetchAdminData();
			if (data.length > 0) {
				setAdminData(data[0]);
				setEditedData(data[0]);
				//console.log("edit: ", editedData);
			}
		};

		getAdminData();
	}, []);

	return !adminData ? (
		<LoadingOverlay isLoading />
	) : (
		<div className="min-h-screen w-full flex bg-gray-50 relative">
			<AnimatePresence>
				{notification.show && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 20 }}
						exit={{ opacity: 0, y: -50 }}
						className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
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
				)}
			</AnimatePresence>

			<motion.div
				initial={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
				animate={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 space-y-2 relative"
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
						} px-4 py-3 rounded-lg transition-all ${
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
						<h1 className="text-3xl font-bold text-gray-800">
							Thông tin tài khoản
						</h1>
						{!isEditing && (
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsEditing(true)}
								className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
							>
								<FaEdit />
								<span>Chỉnh sửa</span>
							</motion.button>
						)}
					</div>

					<motion.div
						layout
						className="bg-white rounded-2xl shadow-xl p-8"
					>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-gray-700 mb-2">
										Tên
									</label>
									<input
										type="text"
										className={`w-full p-3 rounded-lg border ${
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
										className={`w-full p-3 rounded-lg border ${
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
									<label className="block text-gray-700 mb-2">
										Địa chỉ
									</label>
									<input
										type="text"
										className={`w-full p-3 rounded-lg border ${
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
									<label className="block text-gray-700 mb-2">
										Email
									</label>
									<input
										type="email"
										className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50"
										value={editedData.email}
										disabled
									/>
								</div>

								<div>
									<label className="block text-gray-700 mb-2">
										Ngày sinh
									</label>
									<input
										type="date"
										className={`w-full p-3 rounded-lg border ${
											isEditing
												? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												: "border-gray-200 bg-gray-50"
										}`}
										value={editedData.birth || ""}
										onChange={(e) => {
											const newBirthDate = new Date(
												e.target.value
											).getTime();
											console.log(
												"New Birth Date (timestamp):",
												newBirthDate
											);
											setEditedData({
												...editedData,
												birth: newBirthDate,
											});
										}}
										disabled={!isEditing}
										required
									/>
								</div>

								<div className="md:col-span-2">
									<label className="block text-gray-700 mb-2">
										Giới tính
									</label>
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
												checked={editedData.gender === "Nữ"}
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
										className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
									>
										Hủy
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										type="submit"
										className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-all duration-300"
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
