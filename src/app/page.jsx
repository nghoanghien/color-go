'use client';

import React, { useState, useEffect } from "react";
import { FaPlane, FaGift, FaStar, FaUser, FaBars, FaTimes, FaTicketAlt, FaPercent, FaShieldAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import PendingOverlay from "@/components/pending-overlay";

const inter = Inter({ subsets: ['latin'] });

const LandingPage = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    setIsPending(true);
    router.push("/login");
  }

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Ánh",
      text: "ColorGo đã làm cho trải nghiệm đặt vé của tôi trở nên dễ dàng và thú vị!",
      rating: 5,
      image: "images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    {
      id: 2,
      name: "Trần Văn Minh",
      text: "Giá tốt nhất và dịch vụ khách hàng tuyệt vời. Rất đáng để giới thiệu!",
      rating: 5,
      image: "images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    },
    {
      id: 3,
      name: "Lê Thị Hương",
      text: "Toàn bộ quá trình đặt vé diễn ra suôn sẻ và không gặp khó khăn gì.",
      rating: 5,
      image: "images.unsplash.com/photo-1438761681033-6461ffad8d80"
    }
  ];

  const popularRoutes = [
    {
      from: "Hà Nội",
      to: "TP. Hồ Chí Minh",
      price: "1.990.000₫",
      image: "/images/ho-chi-minh.jpg"
    },
    {
      from: "Đà Nẵng",
      to: "Phú Quốc",
      price: "1.590.000₫",
      image: "/images/phu-quoc-2.jpg"
    },
    {
      from: "Nha Trang",
      to: "Đà Lạt",
      price: "990.000₫",
      image: "/images/nha-trang.jpg"
    }
  ];

  const specialOffers = [
    {
      id: 1,
      title: "Giảm 30% Chuyến Đi Ngày Tết",
      code: "INT30",
      description: "Áp dụng cho tất cả các chuyến bay quốc tế",
      expiry: "31/12/2024",
      discount: "30%",
      image: "/images/discount1.webp"
    },
    {
      id: 2,
      title: "Ưu Đãi Sinh Viên Trên Toàn Quốc",
      code: "STUDENT25",
      description: "Giảm 25% cho sinh viên có thẻ học sinh hợp lệ",
      expiry: "30/09/2024",
      discount: "25%",
      image: "/images/sinh-vien.jpg"
    },
    {
      id: 3,
      title: "Khuyến Mãi Cuối Mỗi Tuần",
      code: "WEEKEND15",
      description: "Giảm 15% cho đặt vé vào cuối mỗi tuần",
      expiry: "31/12/2024",
      discount: "15%",
      image: "/images/weekend2.jpg"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-400 via-green-300 to-yellow-200 ${inter.className}`}>
      <PendingOverlay isLoading={isPending} />
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"}}`}>
        <div className="max-w-4xl mx-auto px-4 py-4" data-aos="fade-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center space-x-2">
                <img src="/images/Logo-new.png" alt="ColorGo Logo" className="h-14 w-28 rounded-[13px]" />
                <span className="text-2xl font-extrabold tracking-tight text-theme-color-primary">ColorGo</span>
              </div>
              <button className="md:hidden bg-theme-color-primary text-white px-4 py-2 rounded-[13px] hover:bg-theme-color-primary-dark transition-colors flex items-center font-medium tracking-wide" onClick={handleClick}>
                <FaUser className="mr-2" /> Đăng Nhập
              </button>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/login" className="text-gray-700 hover:text-theme-color-primary transition-colors font-medium tracking-wide">Đặt Chỗ Của Tôi</a>
              <a href="/login" className="text-gray-700 hover:text-theme-color-primary transition-colors font-medium tracking-wide">Ưu Đãi Đặc Biệt</a>
              <a href="/login" className="text-gray-700 hover:text-theme-color-primary transition-colors font-medium tracking-wide">Đặt Vé</a>
              <button 
              className="bg-theme-color-primary text-white px-6 py-2 rounded-[13px] hover:bg-theme-color-primary-dark transition-colors flex items-center font-medium tracking-wide" onClick={handleClick}>
                <FaUser className="mr-2" /> Đăng Nhập
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <section className="hero min-h-screen flex items-center justify-center text-center px-4">
          <div className="max-w-3xl mx-auto" data-aos="zoom-in">
            <h1 className="text-4xl md:text-7xl font-black mb-8 text-white drop-shadow-lg tracking-tight leading-tight">
              Cuộc sống là một hành trình<br />đầy sắc màu
              <span className="block text-3xl md:text-5xl mt-6 font-bold tracking-normal">Đặt vé ngay hôm nay!</span>
            </h1>
            <div className="inline-block">
              <div className="bg-yellow-300/30 backdrop-blur-sm p-1 rounded-[18px]">
                <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg tracking-wide" onClick={handleClick}>
                  Đặt Ngay!
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 md:mb-12 tracking-tight" data-aos="fade-up">Tại Sao Chọn ColorGo?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)]" data-aos="fade-right">
                <FaPlane className="text-4xl md:text-5xl text-theme-color-primary mb-4" />
                <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">Giá Tốt Nhất</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">Đảm bảo giá thấp nhất trên mọi tuyến đường với cam kết về giá.</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.5)]" data-aos="fade-up">
                <FaGift className="text-4xl md:text-5xl text-theme-color-secondary mb-4" />
                <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">Ưu Đãi Đặc Biệt</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">Giảm giá thường xuyên và nhiều ưu đãi cho khách hàng thân thiết.</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-blue-50 p-6 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.5)]" data-aos="fade-left">
                <FaStar className="text-4xl md:text-5xl text-yellow-400 mb-4" />
                <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">Hỗ Trợ 24/7</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">Hỗ trợ khách hàng xuyên suốt cho mọi nhu cầu du lịch của bạn.</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.5)]" data-aos="fade-left">
                <FaShieldAlt className="text-4xl md:text-5xl text-purple-600 mb-4" />
                <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">An Toàn Trên Từng Chặng Đường</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">Đảm bảo an toàn tối đa cho mọi hành trình của bạn.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 md:mb-12 tracking-tight" data-aos="fade-up">Tuyến Đường Phổ Biến</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {popularRoutes.map((route, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow" data-aos="flip-left" data-aos-delay={index * 100}>
                  <img src={route.image} alt={route.from + " đến " + route.to} className="w-full h-40 md:h-48 object-cover" />
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold mb-2">{route.from} → {route.to}</h3>
                    <p className="text-xl md:text-2xl font-bold text-theme-color-primary">{route.price}</p>
                    <button className="mt-4 w-full bg-theme-color-primary text-white py-2 rounded-[13px] hover:bg-theme-color-primary-dark transition-colors text-sm md:text-base" onClick={handleClick}>
                      Đặt Ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 px-4 bg-white mb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 md:mb-12 tracking-tight" data-aos="fade-up">Ưu Đãi Đặc Biệt</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {specialOffers.map((offer, index) => (
                <div key={offer.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300" data-aos="flip-up" data-aos-delay={index * 100}>
                  <img src={offer.image} alt={offer.title} className="w-full h-40 md:h-48 object-cover" />
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">{offer.title}</h3>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-[13px] text-sm font-bold">{offer.discount}</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-4">{offer.description}</p>
                    <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FaTicketAlt className="text-theme-color-primary mr-2" />
                        <span className="font-bold text-gray-700">{offer.code}</span>
                      </div>
                      <button className="text-theme-color-primary font-bold hover:text-theme-color-primary-dark">Sao chép</button>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">Hết hạn: {offer.expiry}</p>
                    <button className="mt-4 w-full bg-theme-color-primary text-white py-2 rounded-[13px] hover:bg-theme-color-primary-dark transition-colors flex items-center justify-center text-sm md:text-base" onClick={handleClick}>
                      <FaPercent className="mr-2" />
                      Áp Dụng Ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 md:mb-12 tracking-tight" data-aos="fade-up">Khách Hàng Nói Gì?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="bg-white p-4 md:p-6 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]" data-aos="zoom-in-up" data-aos-delay={index * 100}>
                  <div className="flex items-center mb-4">
                    <div>
                      <h3 className="text-base md:text-lg font-bold">{testimonial.name}</h3>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="text-sm md:text-base" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-600">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 md:py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8" data-aos="fade-up">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">ColorGo</h3>
            <p className="text-sm md:text-base">Mang đến trải nghiệm du lịch đầy màu sắc cho mọi người.</p>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="#about" className="hover:text-theme-color-secondary">Về Chúng Tôi</a></li>
              <li><a href="#contact" className="hover:text-theme-color-secondary">Liên Hệ</a></li>
              <li><a href="#faq" className="hover:text-theme-color-secondary">Câu Hỏi Thường Gặp</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Liên Hệ</h3>
            <p className="text-sm md:text-base">Email: info@colorgo.com</p>
            <p className="text-sm md:text-base">Điện thoại: +84 234 567 890</p>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Theo Dõi Chúng Tôi</h3>
            <div className="flex space-x-4 text-sm md:text-base">
              <a href="#" className="hover:text-theme-color-secondary">Facebook</a>
              <a href="#" className="hover:text-theme-color-secondary">Twitter</a>
              <a href="#" className="hover:text-theme-color-secondary">Instagram</a>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-700 text-center">
          <p className="text-xs md:text-sm">© 2024 ColorGo. Đã đăng ký bản quyền.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;