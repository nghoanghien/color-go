import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const InfoTooltip = ({ 
  message = "This is a notification message",
  className = "" 
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [positionReady, setPositionReady] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const buttonRef = useRef(null);
  const notificationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    setPosition({
      top: buttonRect.top + scrollY + (buttonRect.height / 2),
      left: buttonRect.left + scrollX - 255,
    });
    setButtonPosition({
      top: buttonRect.top,
      left: buttonRect.left,
      width: buttonRect.width,
      height: buttonRect.height,
    })
  };

  useEffect(() => {
    if (!showNotification) return;

    const handlePositionUpdate = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handlePositionUpdate, true);
    
    const resizeObserver = new ResizeObserver(handlePositionUpdate);
    if (buttonRef.current) {
      resizeObserver.observe(buttonRef.current);
    }

    let parent = buttonRef.current?.parentElement;
    while (parent) {
      resizeObserver.observe(parent);
      parent = parent.parentElement;
    }

    return () => {
      window.removeEventListener('scroll', handlePositionUpdate, true);
      resizeObserver.disconnect();
    };
  }, [showNotification]);

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Stop propagation here
    if (showNotification) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleOpen = () => {
    setShowNotification(true);
    setIsAnimating(true);
    
    requestAnimationFrame(() => {
      updatePosition();
      setPositionReady(true);
      setIsAnimating(false);
    });
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowNotification(false);
      setIsAnimating(false);
    }, 150);
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    handleClose();
  };

  const PortalButton = () => (
    <button
    onClick={handleButtonClick}  // Changed to use handleButtonClick
    className={`bg-white/90 rounded-full inline-block overflow-hidden ${showNotification ? "z-40" : ""} ${className}`}
    style={{
      position: 'fixed',
      top: `${buttonPosition.top}px`,
      left: `${buttonPosition.left}px`,
      width: `${buttonPosition.width}px`,
      height: `${buttonPosition.height}px`,
      zIndex: 9999,
    }}
    aria-label="Show notification"
  >
    <AlertCircle className="w-5 h-5 text-gray-500 hover:text-gray-600" />
  </button>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick} // Changed to use handleButtonClick
        className={`relative ${showNotification ? "z-40" : ""} ${className}`}
        aria-label="Show notification"
      >
        <AlertCircle className="w-5 h-5 text-gray-500 hover:text-gray-600" />
      </button>

      <AnimatePresence>
        {showNotification && positionReady && (
          <>
            {createPortal(
              <motion.div
                onClick={handleOverlayClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30"
              />,
              document.body
            )}

            {createPortal(<PortalButton />, document.body)}

            {createPortal(
              <div
                ref={notificationRef}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "fixed",
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                  transform: "translateY(-50%)",
                  zIndex: 50,
                }}
                className={`transition-all duration-200 ease-in-out ${
                  isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <div className="bg-white/90 rounded-lg shadow-lg p-4 max-w-[250px]">
                  <p className="text-gray-700 font-bold">{message}</p>
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

export default InfoTooltip;