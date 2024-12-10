'use client';

import React, { useState } from "react";
import { FaArrowLeft, FaQuestionCircle, FaFacebook, FaEnvelope, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const SupportPage = () => {
  const router = useRouter();
  const [openSection, setOpenSection] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqData = {
    booking: {
      title: "Đặt vé",
      questions: [
        {
          q: "Làm thế nào để đặt vé trực tuyến?",
          a: "Bạn có thể đặt vé trực tuyến thông qua website hoặc ứng dụng di động của chúng tôi. Chỉ cần chọn điểm đến, ngày đi và số lượng vé cần đặt."
        },
        {
          q: "Tôi có thể hủy vé đã đặt không?",
          a: "Có, bạn có thể hủy vé trong vòng 24 giờ trước giờ khởi hành. Phí hủy vé sẽ được tính theo quy định."
        },
        {
          q: "Làm sao để xem lại vé đã đặt?",
          a: "Bạn có thể xem lại vé đã đặt trong phần 'Lịch sử đặt vé' trên tài khoản của mình."
        },
        {
          q: "Có giới hạn số lượng vé được đặt không?",
          a: "Mỗi tài khoản có thể đặt tối đa 10 vé cho một chuyến đi."
        },
        {
          q: "Thời gian đặt vé trước tối thiểu là bao lâu?",
          a: "Bạn cần đặt vé trước ít nhất 2 giờ trước giờ khởi hành."
        }
      ]
    },
    discount: {
      title: "Mã giảm giá",
      questions: [
        {
          q: "Làm sao để nhận mã giảm giá?",
          a: "Mã giảm giá được cung cấp qua email, thông báo ứng dụng hoặc các chương trình khuyến mãi đặc biệt."
        },
        {
          q: "Mã giảm giá có thời hạn sử dụng không?",
          a: "Có, mỗi mã giảm giá đều có thời hạn sử dụng riêng. Bạn cần kiểm tra kỹ thông tin này."
        },
        {
          q: "Có thể sử dụng nhiều mã giảm giá cùng lúc không?",
          a: "Không, mỗi đơn hàng chỉ có thể sử dụng một mã giảm giá."
        },
        {
          q: "Mã giảm giá có áp dụng cho tất cả các tuyến không?",
          a: "Tùy theo điều kiện của từng mã giảm giá, một số mã chỉ áp dụng cho các tuyến nhất định."
        },
        {
          q: "Làm sao để kiểm tra mã giảm giá còn hiệu lực?",
          a: "Bạn có thể kiểm tra trong phần 'Ví voucher' hoặc nhập mã vào ô mã giảm giá khi đặt vé."
        }
      ]
    },
    payment: {
      title: "Thanh toán",
      questions: [
        {
          q: "Có những hình thức thanh toán nào?",
          a: "Chúng tôi chấp nhận thanh toán qua thẻ ngân hàng, ví điện tử, và chuyển khoản ngân hàng."
        },
        {
          q: "Thời gian xử lý thanh toán là bao lâu?",
          a: "Thanh toán thường được xử lý ngay lập tức. Trong một số trường hợp có thể mất đến 24 giờ."
        },
        {
          q: "Làm sao để nhận hóa đơn?",
          a: "Hóa đơn điện tử sẽ được gửi tự động vào email của bạn sau khi thanh toán thành công."
        },
        {
          q: "Có được hoàn tiền khi hủy vé không?",
          a: "Việc hoàn tiền phụ thuộc vào chính sách hủy vé và thời điểm bạn yêu cầu hủy."
        },
        {
          q: "Thanh toán có an toàn không?",
          a: "Chúng tôi sử dụng các biện pháp bảo mật cao nhất để đảm bảo an toàn cho mọi giao dịch."
        }
      ]
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? "" : section);
    setOpenQuestion(null); // Reset open question when changing section
  };

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100/70 via-blue-100/70 to-yellow-100/70 pb-32">
      <div className="bg-transparent p-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300">
            <FaArrowLeft className="text-gray-600 text-xl" onClick={() => {router.back()}}/>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Hỗ trợ & Liên hệ</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-8 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <FaQuestionCircle className="text-5xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bạn cần hỗ trợ?</h2>
          <p className="text-gray-600">Chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaFacebook className="text-2xl text-blue-600" />
                <div>
                  <h3 className="text-lg font-bold">Fanpage</h3>
                  <p className="text-gray-600 text-sm">Hỗ trợ nhanh qua Facebook</p>
                </div>
              </div>
              <div className="flex items-center">
                <a href="#" className="inline-block bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition-colors duration-300 text-sm">
                  Truy cập Fanpage
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-2xl text-green-600" />
                <div>
                  <h3 className="text-lg font-bold">Email</h3>
                  <p className="text-gray-600 text-sm">Giải đáp mọi thắc mắc</p>
                </div>
              </div>
              <a href="mailto:support@example.com" className="inline-block bg-green-500 text-white px-4 py-1.5 rounded-full hover:bg-green-600 transition-colors duration-300 text-sm">
                Gửi Email
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <h2 className="text-xl font-bold p-6 bg-gradient-to-r from-blue-500 to-green-500 text-white">
            Câu hỏi thường gặp
          </h2>

          {Object.entries(faqData).map(([key, section]) => (
            <div key={key} className="border-b border-gray-200 last:border-none">
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
              >
                <span className="font-semibold text-gray-700">{section.title}</span>
                <FaChevronDown
                  className={`text-gray-400 transition-transform duration-300 ${openSection === key ? "transform rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openSection === key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gray-50">
                      {section.questions.map((item, index) => (
                        <div key={index} className="mb-4 last:mb-0 border-b border-gray-200 last:border-none pb-4">
                          <button
                            onClick={() => toggleQuestion(index)}
                            className="w-full text-left flex justify-between items-center"
                          >
                            <h3 className="font-medium text-gray-800">{item.q}</h3>
                            <FaChevronDown
                              className={`text-gray-400 transition-transform duration-300 ${openQuestion === index ? "transform rotate-180" : ""}`}
                            />
                          </button>
                          <AnimatePresence>
                            {openQuestion === index && (
                              <motion.p
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-gray-600 text-sm mt-2"
                              >
                                {item.a}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-8 text-center"
        >
          <img
            src="/images/Logo-new.png"
            alt="Website Logo"
            className="h-12 mx-auto object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;
