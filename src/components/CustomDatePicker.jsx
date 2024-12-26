import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const CustomDatePicker = ({ 
  value, 
  onChange, 
  min, 
  disabled = false,
  required = false, 
  className = "",
  isEditing = true
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [showAbove, setShowAbove] = useState(false);
  
  const buttonRef = useRef(null);
  const pickerRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const parseInitialDate = () => {
    try {
      return value ? new Date(value) : new Date();
    } catch (e) {
      return new Date();
    }
  };

  const [selectedDate, setSelectedDate] = useState(parseInitialDate());
  const [currentMonth, setCurrentMonth] = useState(parseInitialDate().getMonth());
  const [currentYear, setCurrentYear] = useState(parseInitialDate().getFullYear());

  const months = ["Tháng Một,", "Tháng Hai,", "Tháng Ba,", "Tháng Tư,", "Tháng Năm,", "Tháng Sáu,", "Tháng Bảy,", "Tháng Tám,", "Tháng Chín,", "Tháng Mười,", "Tháng 11,", "Tháng 12,"];
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPicker && 
          buttonRef.current && 
          pickerRef.current && 
          !buttonRef.current.contains(event.target) && 
          !pickerRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  const updatePosition = () => {
    if (!buttonRef.current) return;
  
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const pickerHeight = 300;
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - buttonRect.bottom;
    const shouldShowAbove = spaceBelow < pickerHeight && buttonRect.top > pickerHeight;
  
    setShowAbove(shouldShowAbove);
    setPosition({
      top: shouldShowAbove ? buttonRect.top - pickerHeight - 65 : buttonRect.bottom + 5,
      left: buttonRect.left,
    });
    setButtonPosition({
      top: buttonRect.top,
      left: buttonRect.left,
      width: buttonRect.width,
      height: buttonRect.height,
    });
  };
  
  const [positionReady, setPositionReady] = useState(false);

  const handleOpen = () => {
    if (disabled || !isEditing) return;
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

  const handleDateSelect = (e, day) => {
    e.preventDefault();
    if (day) {
      const newDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(newDate);
      // Convert to ISO string and remove the time part
      const isoString = newDate.toISOString().split('T')[0];
      onChange(isoString);
      handleClose();
    }
  };

  const formatDisplayDate = (date) => {
    // Format as YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  const isDateDisabled = (date) => {
    if (!min) return false;
    const minDate = new Date(min);
    return date < minDate;
  };

  const PortalButton = () => (
    <button
        type="button"
        ref={buttonRef}
        onClick={handleOpen}
        disabled={disabled || !isEditing}
        style={{
          position: 'fixed',
          top: `${buttonPosition.top}px`,
          left: `${buttonPosition.left}px`,
          width: `${buttonPosition.width}px`,
          height: `${buttonPosition.height}px`,
          zIndex: 9999,
        }}
        className={`w-full p-3 z-50 bg-white/90 rounded-2xl shadow-md border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none transition-shadow duration-200 ease-in-out text-left ${
          isEditing
            ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            : "border-gray-200 bg-gray-50"
        } ${className}`}
      >
        <span className="flex items-center gap-2">
          <Calendar className="text-gray-500" />
          {formatDisplayDate(selectedDate)}
        </span>
      </button>
  );

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        onClick={handleOpen}
        disabled={disabled || !isEditing}
        className={`w-full p-3 z-50 rounded-2xl border-2 border-blue-100 focus:ring-2 focus:bg-blue-50 focus:ring-blue-200 focus:border-transparent focus:outline-none transition-shadow duration-200 ease-in-out text-left ${
          isEditing
            ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            : "border-gray-200 bg-gray-50"
        } ${className}`}
      >
        <span className="flex items-center gap-2">
          <Calendar className="text-gray-500" />
          {formatDisplayDate(selectedDate)}
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
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-200 rounded-full"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="font-medium text-lg">{`${months[currentMonth]} ${currentYear}`}</span>
                      <button
                        type="button"
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-200 rounded-full"
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
                            day === selectedDate.getDate() &&
                            currentMonth === selectedDate.getMonth() &&
                            currentYear === selectedDate.getFullYear()
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "text-gray-700"
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

export default CustomDatePicker;