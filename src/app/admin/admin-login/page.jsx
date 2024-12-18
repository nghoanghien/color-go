'use client';

import React, { useState } from "react";
import { FaGlobe, FaEnvelope, FaLock } from "react-icons/fa";

const SignIn = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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
      <div className="bg-white/90 backdrop-blur-sm p-12 rounded-xl shadow-2xl w-full max-w-2xl">


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
      </div>
    </div>
  );
};

export default SignIn;