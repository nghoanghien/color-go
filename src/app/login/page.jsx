'use client';

import { signIn } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { FaGoogle, FaFacebook, FaBus, FaRoad, FaShieldAlt, FaTicketAlt, FaMapMarkedAlt, FaUserShield, FaClock, FaCompass, FaChevronDown, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [mascotMood, setMascotMood] = useState("neutral");
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showBookButton, setShowBookButton] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const loginRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      updateMascotMood(e);
    };

    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        if (!isScrolling) {
          setIsScrolling(true);
        }
        setScrollY(currentScrollY);

        if (currentScrollY > lastScrollY) {
          setShowBookButton(false);
        } else {
          setShowBookButton(true);
        }

        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
          setShowBookButton(false);
        }

        setLastScrollY(currentScrollY);

        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolling, lastScrollY]);

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateMascotMood = (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const distanceFromCenter = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    );

    if (distanceFromCenter < 200) setMascotMood("excited");
    else if (e.clientY < window.innerHeight / 3) setMascotMood("surprised");
    else setMascotMood("happy");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = true;
    if (!formData.password) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMascotMood("sad");
    } else {
      setMascotMood("excited");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const Mascot = ({ mood, index }) => {
    const getExpression = () => {
      switch (mood) {
        case "happy":
          return "^‿^";
        case "excited":
          return "♥‿♥";
        case "sad":
          return "﹏";
        case "surprised":
          return "°o°";
        default:
          return "•‿•";
      }
    };

    const colors = ["#6EE7B7", "#FF6B6B", "#4ECDC4"];

    return (
      <div
        className="relative w-24 h-24 md:w-32 md:h-32 transform transition-transform hover:scale-105 hidden md:block"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      >
        <div
          className="absolute inset-0 rounded-xl transition-all duration-300 flex items-center justify-center"
          style={{ backgroundColor: colors[index] }}
        >
          {index === 0 && <FaBus className="text-3xl md:text-4xl text-white" />}
          {index === 1 && <FaRoad className="text-3xl md:text-4xl text-white" />}
          {index === 2 && <FaShieldAlt className="text-3xl md:text-4xl text-white" />}
          <div className="absolute bottom-2 text-xl md:text-2xl text-white">{getExpression()}</div>
        </div>
      </div>
    );
  };

  const features = [
    { icon: <FaTicketAlt />, text: "Đặt vé dễ dàng" },
    { icon: <FaMapMarkedAlt />, text: "Nhiều tuyến đường" },
    { icon: <FaUserShield />, text: "An toàn tối đa" },
    { icon: <FaClock />, text: "Đúng giờ" },
  ];

  const mobileScrollStyle = {
    transition: isScrolling ? "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    transform: `translateY(${isScrolling ? -scrollY * 0.1 : 0}px)`,
  };

  async function handleSignIn() {
    const result = await signIn();
    router.replace('/booking')
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4 md:p-8 overflow-y-auto relative">
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={typeof window !== 'undefined' && window.innerWidth <= 768 ? mobileScrollStyle : {}}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 md:p-12 bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="md:hidden mb-4 md:mb-6">
                <h1 className="text-3xl md:text-5xl font-extrabold text-center poppins bg-white rounded-xl py-2 px-3 md:py-3 md:px-4 shadow-lg flex justify-center items-center">
                  <img src="/images/Logo-new.png" alt="logo" className="w-36 h-16" /> 
                </h1>

                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-dancing-script bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 animate-text">
                  Cuộc sống là những chuyến đi đầy sắc màu, đặt vé ngay hôm nay!
                </h2>
                <p className="text-sm md:text-base text-white/80 mb-4 md:block hidden">Hệ thống đặt vé xe khách trực tuyến uy tín và an toàn</p>
                <div className="flex space-x-4 md:space-x-6 mb-4">
                  {[0, 1, 2].map((index) => (
                    <Mascot key={index} mood={mascotMood} index={index} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 md:gap-3 mt-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-1 md:space-x-2 text-white/90 bg-white/10 rounded-lg p-2 backdrop-blur-sm transition-all hover:bg-white/20">
                      <span className="text-lg md:text-xl">{feature.icon}</span>
                      <span className="text-xs md:text-base">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 md:mt-8">
                {/* <img
                  src="images.unsplash.com/photo-1544620347-c4fd4a3d5957"
                  alt="ColorGo"
                  className="rounded-lg shadow-lg"
                /> */}
              </div>
            </div>
          </div>

          <div ref={loginRef} className="p-6 md:p-12 flex flex-col justify-center items-center space-y-6 md:space-y-8 bg-gradient-to-br from-emerald-50 to-indigo-50">
            <div className="transform hover:scale-105 transition-transform duration-300 hidden md:block">
              <h1 className="text-2xl md:text-2xl font-extrabold text-center poppins">
                  <img src="/images/Logo-new.png" alt="logo" className="w-36 h-auto" />   
              </h1>
            </div>

            <div className="w-full max-w-md transition-all duration-700">
              <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                {/* <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className={`w-full p-3 md:p-4 text-sm md:text-base border ${errors.email ? "border-red-500 animate-shake" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div> */}
                {/* <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    className={`w-full p-3 md:p-4 text-sm md:text-base border ${errors.password ? "border-red-500 animate-shake" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-emerald-400 to-blue-500 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-blue-600 transform transition-all hover:scale-105"
                >
                  Đăng Nhập
                </button>
                <div className="text-center">
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">Quên mật khẩu?</a>
                </div>
                <div className="text-center">
                  <span className="text-gray-600 text-sm md:text-base">Bạn chưa có tài khoản? </span>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm md:text-base font-semibold">Đăng Ký ngay</a>
                </div>
                <div className="text-center text-gray-500 text-sm md:text-base">Hoặc đăng nhập với</div> */}
                <div className="flex flex-col space-y-3 md:space-y-4">
                  <button
                    type="button"
                    className="w-full py-3 md:py-4 text-sm md:text-base bg-red-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-red-600 transform transition-all hover:scale-105"
                    onClick={handleSignIn}
                  >
                    <FaGoogle />
                    <span>Đăng nhập với Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full py-3 md:py-4 text-sm md:text-base bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transform transition-all hover:scale-105"
                    onClick={() => router.push("/in-development")}
                  >
                    <FaFacebook />
                    <span>Đăng nhập với Facebook</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;