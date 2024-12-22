'use client';

import LoadingOverlay from "@/components/loading-overlay";
import PendingOverlay from "@/components/pending-overlay";
import { useRouteDetail } from "@/hooks/useRouteDetail";
import { timeString } from "@/utils/time-manipulation";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from "react";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";


const PickupDropoffPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, route] = useRouteDetail(searchParams.get('id'));
  const [isPending, setIsPending] = useState(false);

  const [activeTab, setActiveTab] = useState("pickup");
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);

  const pickupPoints = route.stops ?? [];

  const dropoffPoints = route.stops ?? [];

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  useEffect(() => {
    if (selectedPickup && activeTab === "pickup") {
      setTimeout(() => setActiveTab("dropoff"), 200);
    }

    if (!selectedPickup) return;
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("pickup", selectedPickup.stop);

    router.replace(`/location?${newSearchParams.toString()}`);
  }, [selectedPickup]);

  useEffect(() => {
    if (!selectedDropoff) return;

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("dropoff", selectedDropoff.stop);

    router.replace(`/location?${newSearchParams.toString()}`);
  }, [selectedDropoff]);

  const handlePointSelection = (point, type) => {
    if (type === "pickup") {
      setSelectedPickup(point);
    } else {
      setSelectedDropoff(point);
    }
  };

  const handleContinueClick = () => {
    setIsPending(true);
    router.push(`/ticket-info?${searchParams.toString()}`);
  }

  return isLoading ? <LoadingOverlay isLoading /> : (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70">
      <PendingOverlay isLoading={isPending} />
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300">
              <FaArrowLeft className="text-gray-600 text-xl" onClick={() => {router.back()}}/>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Chọn điểm đón - điểm trả</h1>
          </div>

          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex space-x-2 mb-6">
              {["pickup", "dropoff"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-xl transition-all duration-200 font-medium ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                      : "bg-white/50 text-gray-600 hover:bg-white/80"
                  }`}
                >
                  {tab === "pickup" ? "Điểm đón" : "Điểm trả"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {(activeTab === "pickup" ? pickupPoints : dropoffPoints).map((point) => (
                  <div
                    key={point.id}
                    onClick={() => handlePointSelection(point, activeTab)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      (activeTab === "pickup" ? selectedPickup?.address : selectedDropoff?.address) === point.address
                        ? "bg-green-100/50 border-2 border-green-500"
                        : "bg-white/70 hover:bg-white border border-gray-100"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <FaMapMarkerAlt className="text-blue-500 text-xl mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{point.stop}</h3>
                        <p className="text-sm text-gray-500 mt-1">{point.address}</p>
                        <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm">
                          {timeString(point.datetime)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Điểm đón:</span>
            <span className="font-medium text-gray-800">
              {selectedPickup ? selectedPickup.stop : "Chưa chọn"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Điểm trả:</span>
            <span className="font-medium text-gray-800">
              {selectedDropoff ? selectedDropoff.stop : "Chưa chọn"}
            </span>
          </div>
          <button
            className={`w-full p-4 rounded-xl font-medium transition-all duration-200 ${
              selectedPickup && selectedDropoff
                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!selectedPickup || !selectedDropoff}
            onClick={handleContinueClick}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default () => {
  return <Suspense fallback={<LoadingOverlay isLoading />}>
    <PickupDropoffPage />
  </Suspense>
};
