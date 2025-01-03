'use client';




import React, { useState, useEffect } from "react";
import { FaHome, FaBus, FaRoute, FaFileInvoice, FaChartBar, FaSignOutAlt, FaUsers, FaCar, FaChevronLeft, FaTicketAlt, FaGift, FaUserCircle } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";




import { useRouter } from "next/navigation";




import { fetchRoute } from "@/services/routes";
import { fetchCustomer } from "@/services/membership";
import LoadingOverlay from "@/components/loading-overlay";
import PendingOverlay from "@/components/pending-overlay";




ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);




const AdminDashboard = () => {
  const router = useRouter();




  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPending, setIsPending] = useState(false);




  const [totalRoute, setTotalRoute] = useState();




  const sidebarItems = [
    { id: "dashboard", label: "Trang chủ", icon: <FaHome /> },
    { id: "coach-company", label: "Nhà xe", icon: <FaBus /> },
    { id: "routes", label: "Chuyến xe", icon: <FaRoute /> },
    { id: "promotions", label: "Ưu Đãi", icon: <FaGift /> },
    { id: "customers", label: "Khách Hàng", icon: <FaUsers /> },
    { id: "tickets", label: "Vé xe", icon: <FaTicketAlt /> },
    { id: "account", label: "Tài khoản", icon: <FaUserCircle /> },
    { id: "logout", label: "Đăng xuất", icon: <FaSignOutAlt /> }
  ];




  const [stats,setStats] = useState([
    { id: 1, title: "Tổng số khách hàng", count: "0", icon: <FaUsers />, color: "from-blue-500 to-cyan-400", fluctuation: "", unit: "Tăng khách hàng", taga: "" },
    { id: 2, title: "Tổng số chuyến xe", count: "0", icon: <FaCar />, color: "from-green-500 to-emerald-400", fluctuation: "", unit: "chuyến", taga: ""   },
    { id: 3, title: "Tổng số lượt đặt vé", count: "0", icon: <FaTicketAlt />, color: "from-emerald-500 to-green-400", fluctuation: "", unit: "vé", taga: ""   }
  ]);




  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
 
  const [bookingData, setBookingData] = useState();
  const [routeData,setRouteData] = useState()


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Thống kê theo tháng"
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };




  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setIsPending(true);
   
    if (tab !== "logout") {
      router.replace(`/admin/${tab}`);
    }
    else {
      router.replace("/admin/admin-login");
    }
  }




  const fetchRoutesData = async () => {
    const fetchedRoute = await fetchRoute(); // Giả sử dữ liệu được trả về từ API
    console.log("Dữ liệu lấy được từ fetchRoute:", fetchedRoute);
 
    // Mảng tháng (1 đến 12) để đếm số chuyến xe theo từng tháng
    const monthlyCounts = Array(12).fill(0); // Khởi tạo mảng có 12 phần tử, tất cả là 0
 
    // Lặp qua fetchedRoute và đếm số chuyến xe cho từng tháng
    fetchedRoute.forEach(route => {
      const departureDate = new Date(route.departureTime.seconds * 1000); // Chuyển timestamp thành đối tượng Date
      const month = departureDate.getMonth(); // Lấy tháng (0 = Jan, 11 = Dec)
      monthlyCounts[month] += 1; // Tăng số chuyến xe cho tháng tương ứng
    });
 
    // Tính toán sự thay đổi số lượng chuyến xe
    const currentMonth = new Date().getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;


      let fluct = monthlyCounts[currentMonth] - monthlyCounts[previousMonth];
      let tanggiam = "↑ tăng";
    if (fluct < 0) {
      fluct = -fluct; // Đổi dấu nếu fluct âm
      tanggiam = "↓ giảm";
    }
    console.log(monthlyCounts[0])
    const total = monthlyCounts.reduce((sum, count) => sum + count, 0);
 
    // Sắp xếp lại thứ tự: tháng 11 và 12 lên đầu
    const reorderedLabels = ["Nov", "Dec", ...months.slice(0, 10)]; // Nhãn mới
    const reorderedData = [
      monthlyCounts[10], // Tháng 11
      monthlyCounts[11], // Tháng 12
      ...monthlyCounts.slice(0, 10) // Tháng 1-10
    ];
 
    setStats(prevStats =>
      prevStats.map(stat =>
        stat.id === 2 ? { ...stat, count: total, fluctuation: fluct, taga: tanggiam } : stat
      )
    );
 
    setRouteData({
      labels: reorderedLabels, // Nhãn mới
      datasets: [
        {
          label: "Số chuyến xe",
          data: reorderedData, // Dữ liệu sắp xếp lại
          backgroundColor: "rgba(16, 185, 129, 0.7)"
        }
      ]
    });
  };


  const fetchCustomerData = async () => {
    const fetchedRoute = await fetchRoute();
    const fetchedCustomer = await fetchCustomer(); // Giả sử dữ liệu được trả về từ API
    console.log("Dữ liệu lấy được từ fetchCustomer:", fetchedCustomer);
 
    const totalTickets = fetchedCustomer.reduce((total, customer) => {
      return total + (customer.tickets ? customer.tickets.length : 0); // Cộng số ticket của mỗi khách hàng
    }, 0);
 
    const routeIds = fetchedCustomer
      .flatMap(customer => customer.tickets || []) // Lấy tất cả tickets của mỗi khách hàng, nếu không có thì trả về mảng rỗng
      .map(ticket => ticket.routeId); // Lấy routeId từ mỗi ticket
 
    const matchedRoutes = routeIds.map(routeId => {
      const route = fetchedRoute.find(route => route.id === routeId); // Tìm route tương ứng
      return route ? route.departureTime : null; // Trả về departureTime nếu route tồn tại
    }).filter(departureTime => departureTime); // Loại bỏ các giá trị null hoặc undefined
 
    const monthlyCounts = Array(12).fill(0); // Khởi tạo mảng có 12 phần tử, tất cả là 0
 
    // Lặp qua matchedRoutes và đếm số lượt đặt vé cho từng tháng
    matchedRoutes.forEach(date => {
      const departureDate = new Date(date.seconds * 1000); // Chuyển timestamp thành đối tượng Date
      const month = departureDate.getMonth(); // Lấy tháng (0 = Jan, 11 = Dec)
      monthlyCounts[month] += 1; // Tăng số lượt đặt vé cho tháng tương ứng
    });
    const currentMonth = new Date().getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    let fluct = monthlyCounts[currentMonth] - monthlyCounts[previousMonth];
      let tanggiam = "↑ tăng";
    if (fluct < 0) {
      fluct = -fluct; // Đổi dấu nếu fluct âm
      tanggiam = "↓ giảm";
    }
 
    // Sắp xếp lại thứ tự: tháng 11 và 12 lên đầu
    const reorderedLabels = ["Nov", "Dec", ...months.slice(0, 10)]; // Nhãn mới
    const reorderedData = [
      monthlyCounts[10], // Tháng 11
      monthlyCounts[11], // Tháng 12
      ...monthlyCounts.slice(0, 10) // Tháng 1-10
    ];
 
    // Cập nhật stats và dữ liệu booking
    setStats(prevStats =>
      prevStats.map(stat =>
        stat.id === 1 ? { ...stat, count: fetchedCustomer.length } : stat
      )
    );
 
    setStats(prevStats =>
      prevStats.map(stat =>
        stat.id === 3 ? { ...stat, count: totalTickets, fluctuation: fluct, taga: tanggiam } : stat
      )
    );
 
    setBookingData({
      labels: reorderedLabels, // Nhãn mới
      datasets: [
        {
          label: "Số lượt đặt vé",
          data: reorderedData, // Dữ liệu sắp xếp lại
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4
        }
      ]
    });
  };
 




  useEffect(() => {
    fetchCustomerData();
    fetchRoutesData();
  }, [])












  return (!bookingData || !routeData) ? <LoadingOverlay isLoading /> : (
    <div className="min-h-screen w-full flex bg-gray-50">
      <PendingOverlay isLoading={isPending} />
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} rounded-tr-3xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 space-y-2 transition-all duration-300 relative`}>
        <div className="mb-8 text-center relative">
          <h2 className={`text-2xl font-bold ${isSidebarCollapsed ? 'hidden' : 'block'}`}>Quản trị viên</h2>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaChevronLeft className={`transition-all duration-300 ${isSidebarCollapsed ? 'rotate-180' : 'rotate-0'}`} />
          </button>
        </div>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isSidebarCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>




      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 drop-shadow-md">Tổng Quan</h1>
         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className={`p-6 bg-gradient-to-r ${stat.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-lg">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-white mt-2">{stat.count}</h3>
                    </div>
                    <div className="text-4xl text-white/90">{stat.icon}</div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">{stat.taga} {stat.fluctuation} {stat.unit} </span>
                    <span className="text-gray-500">so với tháng trước</span>
                  </div>
                </div>
              </div>
            ))}
          </div>




          {/* Statistics Charts */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thống kê lượt đặt vé</h2>
              <Line options={options} data={bookingData} />
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thống kê chuyến xe</h2>
              <Bar options={options} data={routeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default AdminDashboard;


