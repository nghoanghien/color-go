'use client';

import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaWallet, FaMoneyBillWave, FaHistory, FaExchangeAlt, FaPlus, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { adjustUserBalance, getUserWallet } from "@/services/wallet";
import { useUserInfomation } from "@/firebase/authenticate";


const MyWalletPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("balance");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const [isLoading, user] = useUserInfomation();
  const [wallet, setWallet] = useState({point: 20, history: []});

  useEffect(() => {
    if (!user) return;

    (async () => {
      const wallet = await getUserWallet(user.uid);
      setWallet(wallet);
    })();
  }, [user]); 


  const walletData = {
    balance: 2000000,
    transactions: [
      {
        id: 1,
        date: "20/03/2024",
        type: "Nạp tiền",
        amount: "+500000",
        status: "Thành công"
      },
      {
        id: 2,
        date: "18/03/2024",
        type: "Thanh toán vé",
        amount: "-200000",
        status: "Thành công"
      },
      {
        id: 3,
        date: "15/03/2024",
        type: "Hoàn tiền",
        amount: "+150000",
        status: "Thành công"
      }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    // Handle withdrawal logic here
    adjustUserBalance(user.uid, "Rút tiền", -parseInt(withdrawAmount, 10));

    setShowWithdrawModal(false);
    setWithdrawAmount("");
    setBankAccount("");
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    // Handle deposit logic 
    adjustUserBalance(user.uid, "Nạp tiền", parseInt(depositAmount, 10));

    setShowDepositModal(false);
    setDepositAmount("");
    setBankAccount("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 pb-32">
      <div className="bg-transparent p-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300">
            <FaArrowLeft className="text-gray-600 text-xl" onClick={() => {router.back()}} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Ví của tôi</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-6 mt-4">
        {/* Wallet Balance Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-200 to-green-200 flex items-center justify-center shadow-inner">
              <FaWallet className="text-gray-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-sm text-gray-600">Số dư hiện tại</h2>
              <div className="text-3xl font-bold text-gray-800">
                {formatCurrency(wallet.balance)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowDepositModal(true)}
              className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-xl text-blue-600 font-medium hover:bg-blue-100 transition-colors"
            >
              <FaPlus />
              Nạp tiền
            </button>
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-xl text-green-600 font-medium hover:bg-green-100 transition-colors"
            >
              <FaExchangeAlt />
              Rút tiền
            </button>
          </div>
        </div>

        {/* Transactions History */}
        <div className="space-y-4">
          {wallet.history.map((transaction) => (
            <div key={transaction.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">{transaction.title}</h3>
                  <p className="text-xs text-gray-400">{transaction.datetime}</p>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full mt-1 inline-block">
                    Thành công
                  </span>
                </div>
                <span className={`font-semibold ${transaction.fluctuation > 0 ? "text-green-500" : "text-red-500"}`}>
                  {formatCurrency(parseInt(transaction.fluctuation))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Rút tiền</h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền muốn rút
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số tiền"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white font-medium py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Xác nhận rút tiền
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Nạp tiền</h2>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền muốn nạp
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số tiền"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Xác nhận nạp tiền
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyWalletPage;