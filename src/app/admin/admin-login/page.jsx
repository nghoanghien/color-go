'use client';


import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaGlobe, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from 'framer-motion';  // Thêm import framer-motion
import { fetchAdminData } from '../../../services/admin'; // Giữ nguyên import này


const SignIn = () => {
  const router = useRouter();


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


    // Kiểm tra email và password
    adminList.forEach((adminData) => {
      if (adminData.email === formData.email && adminData.password === formData.password) {
        isValidUser = true; // Nếu tìm thấy người dùng hợp lệ
      }
    });


    if (isValidUser) {
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


  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/images/bk2.jpg')`,
        backgroundSize: '100% 100%',  /* Hình ảnh sẽ co giãn để vừa với chiều rộng và chiều cao phần tử */
        backgroundPosition: 'center',  /* Đặt hình ảnh ở giữa phần tử */
        backgroundRepeat: 'no-repeat',  /* Không lặp lại hình ảnh */
        height: '100vh',  /* Đảm bảo chiều cao của phần tử bằng chiều cao màn hình */
        width: '100%'  
      }}
    >
      <motion.div
        className="bg-white/90 backdrop-blur-sm p-12 rounded-xl shadow-2xl w-full max-w-2xl"
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



