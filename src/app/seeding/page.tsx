'use client';

import { db } from "@/firebase/store";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";

function excludeAndPickRandom<T>(array_: T[], excludeItem: T) {
  const array = structuredClone(array_);
  const filteredArray = array.filter(item => item !== excludeItem);

  if (filteredArray.length === 0) {
    throw new Error("No elements left in the array to pick.");
  }

  const randomIndex = Math.floor(Math.random() * filteredArray.length);
  return filteredArray[randomIndex];
}

function pickRandomBusStopsWithTime(busStops_: {stop: string, address: string}[], startTime: Date, numStops: number = 10) {
  const busStops = structuredClone(busStops_);
  const selectedStops = [];
  let currentTime = startTime; // Thời gian hiện tại làm mốc ban đầu

  for (let i = 0; i < numStops; i++) {
    // Chọn ngẫu nhiên một điểm dừng từ danh sách
    const randomIndex = Math.floor(Math.random() * busStops.length);
    const randomStop = busStops[randomIndex];

    // Tăng thời gian ngẫu nhiên từ 30 đến 120 phút
    const incrementMinutes = Math.floor(Math.random() * 90) + 30;
    currentTime = new Date(currentTime.getTime() + incrementMinutes * 60000);

    // Thêm vào danh sách kết quả
    selectedStops.push({
      ...randomStop,
      datetime: currentTime // Định dạng thời gian ISO
    });

    // Xóa điểm dừng đã chọn để không lặp lại
    busStops.splice(randomIndex, 1);
  }

  return selectedStops;
}

function generateCoachCompanyData(name: any) {
  const facilities = [
    "Wifi, nước uống, chăn mềm",
    "Wifi, nước uống",
    "Nước uống, chăn mềm",
    "Wifi, nước uống, ổ cắm sạc",
  ];

  const termConditions = [
    "1. Chính sách hủy vé: Không hoàn tiền trong vòng 24 giờ trước giờ khởi hành.",
    "2. Chính sách đặt vé: Vui lòng đặt vé trước ít nhất 2 giờ.",
    "3. Quy định hành lý: Hành lý không quá 20kg, cấm mang vật phẩm nguy hiểm.",
  ];

  return {
    name: name,
    facility: facilities[Math.floor(Math.random() * facilities.length)],
    numberSeat: 36,
    termConditions: termConditions,
    type: "Giường nằm 2 tầng",
  };
}

const provinces = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Định"
];

const busCompanies = [
  "Phương Trang (Futa Bus)",
  "Hoàng Long",
  "Mai Linh Express",
  "Thanh Buổi",
  "Thành Bưởi",
  "Sao Việt",
  "Xe Camel",
  "Xe Kumho Samco",
  "Xe Hồng Vinh",
  "Xe Phúc Xuyên"
];

const busStops = [
  { stop: "Bến xe Mỹ Đình", address: "20 Phạm Hùng, Nam Từ Liêm" },
  { stop: "Bến xe Giáp Bát", address: "Giải Phóng, Hoàng Mai" },
  { stop: "Bến xe Nước Ngầm", address: "Km8 Giải Phóng, Hoàng Mai" },
  { stop: "Bến xe Gia Lâm", address: "Ngô Gia Khảm, Long Biên" },
  { stop: "Bến xe Yên Nghĩa", address: "Quốc lộ 6, Hà Đông" },
  { stop: "Điểm dừng Cầu Giấy", address: "Đường Cầu Giấy, Cầu Giấy" },
  { stop: "Điểm dừng Kim Mã", address: "Đường Kim Mã, Ba Đình" },
  { stop: "Điểm dừng Long Biên", address: "Phố Yên Phụ, Long Biên" },
  { stop: "Điểm dừng Nguyễn Trãi", address: "Đường Nguyễn Trãi, Thanh Xuân" },
  { stop: "Điểm dừng Giải Phóng", address: "Đường Giải Phóng, Hoàng Mai" },
  { stop: "Điểm dừng Thanh Xuân", address: "Đường Lê Văn Lương, Thanh Xuân" },
  { stop: "Điểm dừng Hoàng Quốc Việt", address: "Đường Hoàng Quốc Việt, Cầu Giấy" },
  { stop: "Điểm dừng Nguyễn Văn Cừ", address: "Đường Nguyễn Văn Cừ, Long Biên" },
  { stop: "Điểm dừng Đại Cồ Việt", address: "Đường Đại Cồ Việt, Hai Bà Trưng" },
  { stop: "Điểm dừng Tôn Đức Thắng", address: "Đường Tôn Đức Thắng, Đống Đa" },
  { stop: "Điểm dừng Tây Sơn", address: "Đường Tây Sơn, Đống Đa" },
  { stop: "Điểm dừng Láng Hạ", address: "Đường Láng Hạ, Đống Đa" },
  { stop: "Điểm dừng Trung Kính", address: "Đường Trung Kính, Cầu Giấy" },
  { stop: "Điểm dừng Hồ Tùng Mậu", address: "Đường Hồ Tùng Mậu, Nam Từ Liêm" },
  { stop: "Điểm dừng Trần Duy Hưng", address: "Đường Trần Duy Hưng, Cầu Giấy" },
  { stop: "Điểm dừng Phạm Văn Đồng", address: "Đường Phạm Văn Đồng, Bắc Từ Liêm" },
  { stop: "Điểm dừng Xuân Thủy", address: "Đường Xuân Thủy, Cầu Giấy" },
  { stop: "Điểm dừng Đào Tấn", address: "Đường Đào Tấn, Ba Đình" },
  { stop: "Điểm dừng Vành Đai 3", address: "Đường vành đai 3, Thanh Xuân" },
  { stop: "Điểm dừng Linh Đàm", address: "Khu đô thị Linh Đàm, Hoàng Mai" },
  { stop: "Điểm dừng Ngã Tư Sở", address: "Ngã tư Sở, Đống Đa" },
  { stop: "Điểm dừng Ngọc Hồi", address: "Đường Ngọc Hồi, Hoàng Mai" },
  { stop: "Điểm dừng Đại Kim", address: "Khu đô thị Đại Kim, Hoàng Mai" },
  { stop: "Điểm dừng Đông Ngạc", address: "Đường Đông Ngạc, Bắc Từ Liêm" },
  { stop: "Điểm dừng Thanh Trì", address: "Đường Ngọc Hồi, Thanh Trì" }
];

export default function Page() {
  const [dateNum, setDateNum] = useState(5);

  function handleGenerateRoutes() {
    const ONE_DAY_TIME = 24 * 60 * 60 * 1000;
    Array(dateNum * 2).fill('').forEach((_, dateOffset) => {  
      provinces.forEach(province => {
        const departureTimeNum = new Date().getTime() + (dateOffset) * ONE_DAY_TIME + Math.random() * ONE_DAY_TIME;
        const arrivalTimeNum = departureTimeNum + Math.random() * ONE_DAY_TIME; 
        const routeData = {
          departureLocation: province,
          departureTime: new Date(departureTimeNum),
          arrivalLocation: excludeAndPickRandom(provinces, province),
          arrivalTime: new Date(arrivalTimeNum),
          name: excludeAndPickRandom(busCompanies, ''),
          stops: pickRandomBusStopsWithTime(busStops, new Date(departureTimeNum), Math.ceil(Math.random() * 5 + 5)),
          price: Math.ceil(Math.random() * 5) * 50_000 + 150_000,
          totalSeat: 36,
          bookedSeats: []
        };
        addDoc(collection(db, "routes"), routeData);
        // console.log(routeData)
      })
    })
  }

  function addCoachCompanies() {
    console.log("hi");
    const coachCollection = collection(db, "coachCompanies");
  
    for (const company of busCompanies) {
      const companyData = generateCoachCompanyData(company);     
      addDoc(coachCollection, companyData);     
    }
  }

  return (
    <div>
      <div>
        <label htmlFor="date-num">Date num: </label>
        <input id="date-num" value={dateNum} onChange={e => setDateNum(parseInt(e.target.value))} type="number" />
        <button onClick={handleGenerateRoutes}>Generate routes</button>
      </div>
    <button onClick={addCoachCompanies}>Add data for coachCompanies</button>
    <button onClick={() => console.log("Button clicked!")}>Test Button</button>

    </div>
  );
}

