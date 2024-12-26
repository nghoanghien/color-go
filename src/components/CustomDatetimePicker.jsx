import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const CustomDateTimePicker = ({
  value = new Date().toISOString(),
  onChange,
  min,
  required = false,
  className = "",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [showAbove, setShowAbove] = useState(false);

  const buttonRef = useRef(null);
  const pickerRef = useRef(null);
  const originalButtonRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const parseInitialDate = () => {
    try {
      return new Date(value);
    } catch (e) {
      return new Date();
    }
  };

  const [selectedDateTime, setSelectedDateTime] = useState(parseInitialDate());
  const [currentMonth, setCurrentMonth] = useState(
    parseInitialDate().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    parseInitialDate().getFullYear()
  );

  const months = [
    "Tháng Một,",
    "Tháng Hai,",
    "Tháng Ba,",
    "Tháng Tư,",
    "Tháng Năm,",
    "Tháng Sáu,",
    "Tháng Bảy,",
    "Tháng Tám,",
    "Tháng Chín,",
    "Tháng Mười,",
    "Tháng 11,",
    "Tháng 12,",
  ];
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  useEffect(() => {
    try {
      const date = new Date(value);
      setSelectedDateTime(date);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    } catch (e) {
      console.error("Invalid date value");
    }
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPicker &&
        buttonRef.current &&
        pickerRef.current &&
        !buttonRef.current.contains(event.target) &&
        !pickerRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const pickerHeight = 300; // Chiều cao của picker, có thể thay đổi tùy theo thiết kế
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - buttonRect.bottom;
    const shouldShowAbove =
      spaceBelow < pickerHeight && buttonRect.top > pickerHeight;

    setShowAbove(shouldShowAbove);
    setPosition({
      top: shouldShowAbove
        ? buttonRect.top - pickerHeight - 80
        : buttonRect.bottom + 5, // Khoảng cách 10px giữa button và picker
      left: buttonRect.left - (350 - buttonRect.width / 2), // Căn trái của picker với nút chọn
      width: 700, // Đảm bảo picker có cùng chiều rộng với nút
    });
    setButtonPosition({
      top: buttonRect.top,
      left: buttonRect.left,
      width: buttonRect.width,
      height: buttonRect.height,
    })
  };

  const [positionReady, setPositionReady] = useState(false);

  const handleOpen = () => {
    updatePosition();
    setPositionReady(true);
    setShowPicker(true);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 0);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowPicker(false);
      setPositionReady(false);
      setIsAnimating(false);
    }, 150);
  };

  // Các hàm xử lý calendar (giữ nguyên như cũ)
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const nextMonth = (e) => {
    e.preventDefault();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = (e) => {
    e.preventDefault();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleDateSelect = (e, day) => {
    e.preventDefault();
    if (day) {
      const newDate = new Date(selectedDateTime);
      newDate.setFullYear(currentYear);
      newDate.setMonth(currentMonth);
      newDate.setDate(day);
      setSelectedDateTime(newDate);
      onChange(newDate.toISOString());
    }
  };

  const handleTimeChange = (e, type, value) => {
    e.preventDefault();
    const newDate = new Date(selectedDateTime);
    if (type === "hour") {
      newDate.setHours(value);
    } else if (type === "minute") {
      newDate.setMinutes(value);
    }
    setSelectedDateTime(newDate);
    onChange(newDate.toISOString());
  };

  const generateHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      minutes.push(i);
    }
    return minutes;
  };

  const formatDisplayDateTime = (date) => {
    return `${date.toLocaleDateString()}, ${String(date.getHours()).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const isDateDisabled = (date) => {
    if (!min) return false;
    const minDate = new Date(min);
    return (
      date.getFullYear() < minDate.getFullYear() ||
      (date.getFullYear() === minDate.getFullYear() &&
        date.getMonth() < minDate.getMonth()) ||
      (date.getFullYear() === minDate.getFullYear() &&
        date.getMonth() === minDate.getMonth() &&
        date.getDate() < minDate.getDate())
    );
    };

  const PortalButton = () => (
    <button
      type="button"
      onClick={showPicker ? handleClose : handleOpen}
      style={{
        position: 'fixed',
        top: `${buttonPosition.top}px`,
        left: `${buttonPosition.left}px`,
        width: `${buttonPosition.width}px`,
        height: `${buttonPosition.height}px`,
        zIndex: 9999,
      }}
      className={`bg-white/90 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      <span className="flex items-center gap-2">
        <Calendar className="text-gray-500" />
        {formatDisplayDateTime(selectedDateTime)}
      </span>
    </button>
  );


  return (
    <>
      <button
        type="button" // Prevent form submission
        ref={buttonRef}
        onClick={showPicker ? handleClose : handleOpen}
        className={`w-full relative ${showPicker ? "z-40" : ""} bg-white/90 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        aria-label="Select date and time"
      >
        <span className="flex items-center gap-2">
          <Calendar className="text-gray-500" />
          {formatDisplayDateTime(selectedDateTime)}
        </span>
      </button>

      <AnimatePresence>
        {showPicker && positionReady && (
          <>
            {/* Overlay with blur effect */}
            {createPortal(
              <motion.div
                onClick={handleClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              />,
              document.body
            )}
            {createPortal(<PortalButton />, document.body)}
            {createPortal(
              <div
                ref={pickerRef}
                style={{
                  position: "fixed",
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                  width: `${position.width}px`,
                  zIndex: 50,
                }}
                className={`transition-all duration-200 ease-in-out rounded-2xl shadow-xl ${
                  isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <div className="bg-white/90 rounded-xl shadow-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Calendar Section */}
                    <div className="bg-white/90 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={prevMonth}
                          className="p-2 hover:bg-gray-50 rounded-full"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-medium text-lg">{`${months[currentMonth]} ${currentYear}`}</span>
                        <button
                          type="button"
                          onClick={nextMonth}
                          className="p-2 hover:bg-gray-50 rounded-full"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {days.map((day) => (
                          <div
                            key={day}
                            className="text-center text-sm font-medium text-gray-600"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {generateCalendarDays().map((day, index) => {
                          const currentDate = day
                            ? new Date(currentYear, currentMonth, day)
                            : null;
                          const isDisabled = currentDate
                            ? isDateDisabled(currentDate)
                            : true;

                          return (
                            <button
                              type="button"
                              key={index}
                              onClick={(e) =>
                                !isDisabled && handleDateSelect(e, day)
                              }
                              className={`
                          p-2 rounded-lg text-sm font-medium
                          ${
                            !day
                              ? "invisible"
                              : isDisabled
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-blue-100"
                          }
                          ${
                            day === selectedDateTime.getDate() &&
                            currentMonth === selectedDateTime.getMonth() &&
                            currentYear === selectedDateTime.getFullYear()
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "text-black-700"
                          }
                        `}
                              disabled={isDisabled}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Section */}
                    <div className="bg-white/90 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Hours */}
                        <div
                          className="bg-white/90 rounded-lg p-2 h-72 overflow-y-auto"
                          style={{ scrollbarWidth: "none" }}
                        >
                          <div className="text-center rounded-lg text-md font-medium text-gray-600 mb-2 bg-white/90 sticky top-0 z-10">
                            Giờ (24h)
                          </div>
                          {generateHours().map((hour) => (
                            <button
                              type="button"
                              key={hour}
                              onClick={(e) => handleTimeChange(e, "hour", hour)}
                              className={`w-full text-center py-2 rounded-lg mb-1 transition-all duration-200
                          ${
                            hour === selectedDateTime.getHours()
                              ? "bg-blue-500 text-white"
                              : "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          }
                          ${
                            hour === selectedDateTime.getHours()
                              ? "shadow-md"
                              : ""
                          }
                        `}
                            >
                              {String(hour).padStart(2, "0")}
                            </button>
                          ))}
                        </div>

                        {/* Minutes */}
                        <div
                          className="bg-white/90 rounded-lg p-2 h-72 overflow-y-auto"
                          style={{ scrollbarWidth: "none" }}
                        >
                          <div className="text-center rounded-lg text-md font-medium text-gray-600 mb-2 bg-white/90 sticky top-0 z-10">
                          Phút
                          </div>
                          {generateMinutes().map((minute) => (
                            <button
                              type="button"
                              key={minute}
                              onClick={(e) =>
                                handleTimeChange(e, "minute", minute)
                              }
                              className={`w-full text-center py-2 rounded-lg mb-1 transition-all duration-200
                          ${
                            minute === selectedDateTime.getMinutes()
                              ? "bg-blue-500 text-white"
                              : "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          }
                          ${
                            minute === selectedDateTime.getMinutes()
                              ? "shadow-md"
                              : ""
                          }
                        `}
                            >
                              {String(minute).padStart(2, "0")}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomDateTimePicker;