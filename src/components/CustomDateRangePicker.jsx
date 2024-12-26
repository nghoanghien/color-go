import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const CustomDateRangePicker = ({
  startDate = null,
  endDate = null,
  onStartDateChange,
  onEndDateChange,
  className = "",
  placeholder = "Chọn ngày",
  isEndDate = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isAnimating, setIsAnimating] = useState(false);

  const buttonRef = useRef(null);
  const pickerRef = useRef(null);

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
    if (startDate) {
      setCurrentMonth(startDate.getMonth());
      setCurrentYear(startDate.getFullYear());
    }
  }, [startDate]);

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
    const pickerHeight = 380;
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - buttonRect.bottom;
    const shouldShowAbove =
      spaceBelow < pickerHeight && buttonRect.top > pickerHeight;

    setPosition({
      top: shouldShowAbove
        ? buttonRect.top - pickerHeight - 10
        : buttonRect.bottom + 5,
      left: buttonRect.left,
      width: Math.max(buttonRect.width, 320),
    });
  };

  const handleOpen = () => {
    updatePosition();
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
      setIsAnimating(false);
    }, 150);
  };

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

  const handleDateSelect = (day) => {
    if (!day) return;

    const selectedDate = new Date(currentYear, currentMonth, day);

    if (isEndDate) {
      if (startDate && selectedDate < startDate) return;
      // Set time to 23:59:59.999 for end date
      selectedDate.setHours(23, 59, 59, 999);
      onEndDateChange(selectedDate);
    } else {
      if (endDate && selectedDate > endDate) {
        onEndDateChange(null);
      }
      // Set time to 00:00:00.000 for start date
      selectedDate.setHours(0, 0, 0, 0);
      onStartDateChange(selectedDate);
    }

    handleClose();
  };

  const isDateDisabled = (day) => {
    if (!day) return true;
    if (isEndDate && startDate) {
      const currentDate = new Date(currentYear, currentMonth, day);
      return currentDate < startDate;
    }
    return false;
  };

  const formatDisplayDate = (date) => {
    if (!date) return placeholder;
    return date.toLocaleDateString("vi-VN");
  };

  const isDateInRange = (day) => {
    if (!day || !startDate || !endDate) return false;
    const currentDate = new Date(currentYear, currentMonth, day);
    currentDate.setHours(12, 0, 0, 0); // Set to noon to avoid time comparison issues
    const startDateCopy = new Date(startDate);
    startDateCopy.setHours(0, 0, 0, 0);
    const endDateCopy = new Date(endDate);
    endDateCopy.setHours(23, 59, 59, 999);
    return currentDate >= startDateCopy && currentDate <= endDateCopy;
  };

  const isSelectedDate = (day) => {
    if (!day) return false;
    const currentDate = new Date(currentYear, currentMonth, day);
    currentDate.setHours(12, 0, 0, 0); // Set to noon to avoid time comparison issues
    const compareDate = isEndDate ? endDate : startDate;

    if (!compareDate) return false;

    const compareDateCopy = new Date(compareDate);
    compareDateCopy.setHours(12, 0, 0, 0);

    return currentDate.getTime() === compareDateCopy.getTime();
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={showPicker ? handleClose : handleOpen}
        className={`p-3 ${showPicker ? "z-40" : ""} bg-white/90 focus:ring-2 focus:bg-blue-50 focus:outline-none w-full shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out ${className}`}
      >
        <span className="flex items-center gap-2 text-gray-600">
          <Calendar className="text-gray-400" />
          {isEndDate
            ? formatDisplayDate(endDate)
            : formatDisplayDate(startDate)}
        </span>
      </button>

      <AnimatePresence>
        {showPicker && (
          <>
            {/* Overlay with blur effect */}
            {createPortal(
              <motion.div
                onClick={handleClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30"
              />,
              document.body
            )}

            {/* Date Picker */}
            {createPortal(
              <div
                ref={pickerRef}
                style={{
                  position: "fixed",
                  top: `${position.top + 2}px`,
                  left: `${position.left}px`,
                  width: `${position.width}px`,
                  zIndex: 50, // Higher than overlay
                }}
                className={`transition-all duration-200 ease-in-out bg-white/90 rounded-2xl shadow-xl ${
                  isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-medium">
                      {`${months[currentMonth]} ${currentYear}`}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {days.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-600"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((day, index) => {
                      const isDisabledDate = isDateDisabled(day);
                      const isInRange = isDateInRange(day);
                      const isSelected = isSelectedDate(day);

                      return (
                        <button
                          key={index}
                          onClick={() =>
                            !isDisabledDate && handleDateSelect(day)
                          }
                          disabled={isDisabledDate}
                          className={`p-2 rounded-lg text-sm font-medium
                    ${!day ? "invisible" : ""}
                    ${
                      isDisabledDate
                        ? "text-gray-300 cursor-not-allowed"
                        : "hover:bg-blue-100"
                    }
                    ${isSelected ? "bg-blue-500 text-white" : ""}
                    ${isInRange ? "bg-blue-100" : ""}
                  `}
                        >
                          {day}
                        </button>
                      );
                    })}
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

export default CustomDateRangePicker;