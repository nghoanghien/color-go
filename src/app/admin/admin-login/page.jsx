'use client';


import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaGlobe, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from 'framer-motion';  // Thêm import framer-motion
import { fetchAdminData } from '../../../services/admin'; // Giữ nguyên import này
import { useSignout } from "@/hooks/useSignout";


const SignIn = () => {
  const router = useRouter();

  const handleSignout = useSignout();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
    language: "English"
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminList = await fetchAdminData(); // Lấy dữ liệu admin từ Firestore
    let isValidUser = false;
    let adminUser = null;

    // Kiểm tra email và password
    adminList.forEach((adminData) => {
      if (adminData.email === formData.email && adminData.password === formData.password) {
        isValidUser = true; // Nếu tìm thấy người dùng hợp lệ
        adminUser = adminData;
      }
    });


    if (isValidUser) {
      localStorage.setItem("admin-user", JSON.stringify(adminUser));
      console.log("Đăng nhập thành công:", formData);
      handleVerify(); // Chuyển hướng nếu thông tin hợp lệ
    } else {
      console.error("Không đúng email hoặc mật khẩu"); // Thông báo lỗi
      alert("Không đúng email hoặc mật khẩu"); // Hiển thị thông báo cho người dùng
    }
  };


  const handleVerify = () => {
    router.push("/admin/dashboard");
  };

  useEffect(() => {
    handleSignout();
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat bg-gradient-to-br from-blue-500 via-green-400 to-blue-500"
      
    >

      {/* Dòng chữ ColorGo trên đầu trang */}
      <div className="absolute top-9 left-1/2 transform -translate-x-1/2 text-4xl font-extrabold text-white z-40 text-4xl md:text-7xl font-black mb-8 text-white drop-shadow-lg tracking-tight leading-tight">
        ColorGo
      </div>

      {/* Dòng chữ ColorGo ở chính giữa */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl md:text-8xl font-black mb-8 text-white drop-shadow-lg tracking-tight leading-tight">
        ColorGo
      </div>
          <motion.div
        className="bg-white/90 backdrop-blur-sm p-12 rounded-xl shadow-2xl z-50 w-full max-w-2xl"
        initial={{ opacity: 0 }}   // Hiệu ứng bắt đầu từ opacity 0
        animate={{ opacity: 1 }}   // Sau khi render, opacity sẽ là 1
        transition={{ duration: 1 }} // Thời gian hiệu ứng là 1 giây
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Xác thực Quản trị viên</h2>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Địa chỉ Email"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
              aria-label="Email Address"
            />
          </div>


          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
              aria-label="Password"
            />
          </div>


          <button
            type="submit"
            className="w-full py-3 px-4 text-xl bg-gradient-to-r from-green-500 to-green-300 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Xác thực
          </button>
        </form>
      </motion.div>
    </div>
  );
};


export default SignIn;



