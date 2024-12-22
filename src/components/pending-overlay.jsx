import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const PendingOverlay = ({ isLoading }) => (
  <AnimatePresence>
    <motion.div
      key="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{ pointerEvents: isLoading ? "auto" : "none" }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm ${
        !isLoading ? "pointer-events-none" : ""
      }`}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isLoading ? 1 : 0.8,
          opacity: isLoading ? 1 : 0
        }}
        transition={{ 
          duration: 0.4,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <div className="w-32 h-32 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <div className="w-full h-full rounded-full relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0%, rgba(59, 130, 246, 0.2) 25%, rgba(74, 222, 128, 0.2) 50%, transparent 75%, transparent 100%)",
                  transform: "rotate(-45deg)",
                  animation: "comet 1s linear infinite",
                  filter: "blur(8px)",
                }}
              ></div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-2 rounded-full bg-gradient-to-r from-green-400/20 to-blue-500/20 opacity-50"
                style={{ filter: "blur(12px)" }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export default PendingOverlay;