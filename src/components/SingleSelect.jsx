import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SingleSelect = ({
  options = [],
  placeholder = "Chọn địa điểm...",
  onChange,
  value = "",
  className = "",
  containerClassName = "",
  dropdownClassName = "",
  optionClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
    onChange(option);
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            w-full p-4 rounded-2xl shadow-md bg-white/90 
            cursor-pointer flex items-center gap-2 
            hover:shadow-lg transition-all duration-200 
            focus:ring-2 focus:ring-blue-200 focus:bg-blue-50
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
          {value ? (
            <span className="text-black">{value}</span>
          ) : (
            <span className="text-gray-400 text-md">{placeholder}</span>
          )}

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
              className={`absolute w-full mt-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg z-50 overflow-hidden ${dropdownClassName}`}
            >
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  className="w-full p-2 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                    className={`p-3 cursor-pointer hover:bg-gray-100 ${
                      value === option
                        ? "bg-blue-50 text-black"
                        : "text-gray-700"
                    } ${optionClassName}`}
                    onClick={() => handleOptionSelect(option)}
                  >
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
    </div>
  );
};

export default SingleSelect;