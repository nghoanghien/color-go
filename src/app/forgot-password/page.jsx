'use client';

import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SuccessModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm relative"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-8 h-8 text-green-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-semibold text-gray-800 mb-2"
              >
                Đặt lại mật khẩu thành công!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-center"
              >
                Bạn có thể đăng nhập bằng mật khẩu mới
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOTPValid, setIsOTPValid] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      setTimer(60);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handleSendOTP = () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Định dạng email không hợp lệ");
      return;
    }
    setShowOTPInput(true);
    setIsTimerRunning(true);
    setError("");
  };

  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyOTP = () => {
    const enteredOTP = otp.join("");
    if (enteredOTP.length !== 6) {
      setError("Vui lòng nhập đủ 6 số");
      setIsOTPValid(false);
      return;
    }
    if (enteredOTP === "123456") {
      setShowPasswordFields(true);
      setError("");
      setIsOTPValid(true);
    } else {
      setError("Mã OTP không đúng");
      setIsOTPValid(false);
    }
  };

  const handleResendOTP = () => {
    setTimer(60);
    setIsTimerRunning(true);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setIsOTPValid(null);
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setError("");
    setShowSuccessModal(true);
  };

  const fadeInUpVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const getOTPInputStyle = (index) => {
    let style = "w-full h-full text-center border rounded-lg focus:outline-none transition-all duration-200 font-bold text-lg ";
    if (isOTPValid === true) {
      style += "border-green-500 focus:ring-2 focus:ring-green-500 text-green-600";
    } else if (isOTPValid === false) {
      style += "border-red-500 focus:ring-2 focus:ring-red-500 text-red-600";
    } else {
      style += "border-gray-300 focus:ring-2 focus:ring-blue-500";
    }
    return style;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-800 mr-4 transition-colors duration-200"
          >
            <FaArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Quên mật khẩu</h2>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUpVariants}
            transition={{ duration: 0.3 }}
          >
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-bold"
              disabled={showOTPInput}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {!showOTPInput && (
              <motion.button
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInUpVariants}
                onClick={handleSendOTP}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
              >
                Gửi mã
              </motion.button>
            )}

            {showOTPInput && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInUpVariants}
                className="space-y-4"
              >
                <div className="grid grid-cols-6 gap-2">
                  {otp.map((digit, index) => (
                    <div key={index} className="w-full aspect-square">
                      <motion.input
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={getOTPInputStyle(index)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleResendOTP}
                    disabled={isTimerRunning}
                    className={`text-sm transition-colors duration-200 ${isTimerRunning ? "text-gray-400" : "text-blue-500 hover:text-blue-600"}`}
                  >
                    {isTimerRunning ? `Gửi lại mã (${timer}s)` : "Gửi lại mã"}
                  </button>
                  <button
                    onClick={handleVerifyOTP}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
                  >
                    Xác nhận
                  </button>
                </div>
              </motion.div>
            )}

            {showPasswordFields && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInUpVariants}
                className="space-y-4"
              >
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResetPassword}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
                >
                  Đặt lại mật khẩu
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default ForgotPassword;