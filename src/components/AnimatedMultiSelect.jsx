import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedMultiSelect = ({ 
  options = [], 
  placeholder = "Chọn địa điểm...",
  onChange,
  maxSelections = 1,
  value = [],
  className = "",
  containerClassName = "",
  dropdownClassName = "",
  optionClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsFocused(true);
  };

  const handleOptionSelect = (option) => {
    if (maxSelections === 1) {
      onChange([option]);
      setIsOpen(false);
      return;
    }

    const isSelected = value.includes(option);
    if (isSelected) {
      onChange(value.filter(item => item !== option));
    } else {
      if (value.length >= maxSelections) {
        setError(`Chỉ được chọn tối đa ${maxSelections} lựa chọn`);
        return;
      }
      onChange([...value, option]);
    }
    setError("");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeOption = (optionToRemove) => {
    onChange(value.filter(option => option !== optionToRemove));
    setError("");
  };

  return (
    <div className={`relative w-full ${containerClassName}`} ref={dropdownRef}>
      <motion.div
        className={`relative w-full ${isOpen ? "z-40" : ""}`}
        initial={false}
        animate={{ scale: isOpen ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`
            w-full p-3 rounded-2xl shadow-md border-4 border-gray-200 bg-white/90 
            cursor-pointer flex flex-wrap items-center gap-2 
            hover:shadow-xl transition-all duration-200
            focus:ring-2 focus:ring-blue-200 focus:bg-blue-50  /* Thêm các class focus vào đây */
            ${isFocused ? "ring-2 ring-blue-200 bg-blue-50" : ""}
            ${className}
          `}
          onClick={toggleDropdown}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!dropdownRef.current.contains(e.relatedTarget)) {
              setIsFocused(false);
            }
          }}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={0}
        >
          <AnimatePresence>
            {value.length > 0 ? (
              value.map((option) => (
                <motion.span
                  key={option}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-xl flex items-center gap-1"
                >
                  {option}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(option);
                    }}
                    className="hover:text-red-500 transition-colors duration-200"
                  >
                    ×
                  </button>
                </motion.span>
              ))
            ) : (
              <span className="text-gray-500 text-md">{placeholder}</span>
            )}
          </AnimatePresence>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="ml-auto w-5 h-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </motion.svg>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30"
              onClick={() => setIsOpen(false)} // Đóng dropdown khi nhấn vào overlay
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute w-full mt-2 bg-white/90 rounded-2xl shadow-lg z-50 overflow-hidden ${dropdownClassName}`}
            >
              {/* Rest of the dropdown content remains the same */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  className="w-full p-2 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <motion.div
                className="max-h-96 overflow-auto"
                initial={false}
                animate={{ height: "auto" }}
                style={{ scrollbarWidth: "thin" }}
              >
                {filteredOptions.map((option) => (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 cursor-pointer flex items-center gap-2 transition-all ${
                      value.includes(option)
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-100"
                    } ${optionClassName}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        scale: value.includes(option) ? 1.1 : 1,
                        backgroundColor: value.includes(option)
                          ? "#3B82F6"
                          : "#fff",
                      }}
                      className={`w-4 h-4 border-2 rounded-md text-gray-700 ${
                        value.includes(option)
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {value.includes(option) && (
                        <motion.svg
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-full h-full text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                      )}
                    </motion.div>
                    {option}
                  </motion.div>
                ))}

                {filteredOptions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 text-center text-gray-500"
                  >
                    Không tìm thấy kết quả
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-sm mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedMultiSelect;