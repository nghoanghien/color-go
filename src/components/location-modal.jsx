"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getRouteNames } from "../services/routes";
import { useState, useEffect } from "react";

const LocationModal = ({ isOpen, onClose, onSelect, title, position }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    (async () => {
      const routeNames = await getRouteNames();
      setLocations(Array.from(Object.keys(routeNames)));
    })();
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              zIndex: 50,
            }}
            className="bg-white p-6 rounded-2xl w-80 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
            <div className="grid gap-2 max-h-64 overflow-y-auto custom-scrollbar">
              {locations.map((location) => (
                <motion.button
                  key={location}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100 rounded-lg transition-colors"
                  onClick={() => {
                    onSelect(location);
                    onClose();
                  }}
                >
                  {location}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LocationModal;
