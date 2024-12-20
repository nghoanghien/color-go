'use client';

import React, { useState } from "react";
import { FaHome, FaBus, FaRoute, FaFileInvoice, FaChartBar, FaSignOutAlt, FaUsers, FaCar, FaChevronLeft, FaTicketAlt, FaGift, FaUserCircle } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";

import { useRouter } from "next/navigation";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const stats = [
    { id: 1, title: "Tổng số khách hàng", count: "2,345", icon: <FaUsers />, color: "from-blue-500 to-cyan-400" },
    { id: 2, title: "Tổng số chuyến xe", count: "1,287", icon: <FaCar />, color: "from-green-500 to-emerald-400" },
    { id: 3, title: "Tổng số lượt đặt vé", count: "3,567", icon: <FaTicketAlt />, color: "from-emerald-500 to-green-400" }
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const bookingData = {
    labels: months,
    datasets: [
      {
        label: "Số lượt đặt vé",
        data: [650, 750, 850, 800, 900, 1000, 1200, 1100, 1300, 1400, 1350, 1500],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4
      }
    ]
  };

  const routeData = {
    labels: months,
    datasets: [
      {
        label: "Số chuyến xe",
        data: [120, 140, 160, 155, 180, 190, 200, 210, 230, 240, 250, 260],
        backgroundColor: "rgba(16, 185, 129, 0.7)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Thống kê theo tháng"
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
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

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 space-y-2 transition-all duration-300 relative`}>
        <div className="mb-8 text-center relative">
          <h2 className={`text-2xl font-bold ${isSidebarCollapsed ? 'hidden' : 'block'}`}>Quản trị viên</h2>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaChevronLeft className={`transition-all duration-300 ${isSidebarCollapsed ? 'rotate-180' : 'rotate-0'}`} />
          </button>
        </div>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isSidebarCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Tổng Quan</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className={`p-6 bg-gradient-to-r ${stat.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-lg">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-white mt-2">{stat.count}</h3>
                    </div>
                    <div className="text-4xl text-white/90">{stat.icon}</div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">↑ Tăng 12% </span>
                    <span className="text-gray-500">so với tháng trước</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics Charts */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thống kê lượt đặt vé</h2>
              <Line options={options} data={bookingData} />
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thống kê chuyến xe</h2>
              <Bar options={options} data={routeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;