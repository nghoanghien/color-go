// Import Firebase SDK
import { Timestamp } from "firebase/firestore";

export const timeString = (timestamp: any) => {
  if (timestamp && timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  //return ""; // Trả về chuỗi rỗng nếu không có timestamp hợp lệ
};

export function formatDate(timestamp: any) {
  const date = new Date(timestamp.seconds * 1000);

  // Create a mapping for weekdays in Vietnamese
  const vietnameseWeekdays = [
    "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
  ];

  // Extract day of the week
  const dayOfWeek = vietnameseWeekdays[date.getDay()];

  // Format the date portion (dd/MM/yyyy)
  const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  const formattedDate = dateFormatter.format(date);

  // Combine the weekday and the formatted date
  return `${dayOfWeek}, ${formattedDate}`;
}

export function formatTimestampToCustom(date: any) {
  const day = String(date.getDate()).padStart(2, '0'); // Đảm bảo 2 chữ số
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

export function convertTimestampToDatetimeLocal(firestoreTimestamp: any) {
  let date;

  // Kiểm tra nếu là đối tượng Firestore.Timestamp
  if (firestoreTimestamp.seconds !== undefined) {
      // Chuyển đổi từ Firestore.Timestamp sang Date
      date = new Date(firestoreTimestamp.seconds * 1000);
  } else if (typeof firestoreTimestamp === "number") {
      // Nếu là Unix timestamp (số giây), chuyển đổi sang Date
      date = new Date(firestoreTimestamp * 1000);
  } else {
      throw new Error("Invalid timestamp format");
  }

  // Lấy các thành phần cần thiết
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Kết hợp thành chuỗi theo định dạng "YYYY-MM-DDTHH:mm"
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function convertDatetimeLocalToFirestoreTimestamp(datetimeString: any) {
  const date = new Date(datetimeString);

  if (isNaN(date.getTime())) {
      throw new Error("Invalid datetime string format");
  }

  // Tạo Firestore.Timestamp từ Date
  return Timestamp.fromDate(date);
}

export function formatTimestampToDate(timestamp: any) {
  // Chuyển Timestamp thành đối tượng Date
  const date = timestamp.toDate();
  
  // Lấy ngày, tháng, năm
  const day = String(date.getDate()).padStart(2, '0');  // Đảm bảo có 2 chữ số
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  // Trả về dạng dd/mm/yyyy
  return `${day}/${month}/${year}`;
}

export function formatFirestoreTimestampToStandard(timestamp: any): string {
  if (!timestamp || !timestamp.toDate) {
    throw new Error('Đầu vào không phải là kiểu Firestore timestamp hợp lệ.');
  }

  const date = timestamp.toDate(); // Chuyển Firestore timestamp thành Date object
  const hours = date.getHours().toString().padStart(2, '0'); // Lấy giờ (HH)
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Lấy phút (mm)
  const day = date.getDate().toString().padStart(2, '0'); // Lấy ngày (dd)
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng (mm)
  const year = date.getFullYear(); // Lấy năm (yyyy)

  return `${hours}:${minutes}, ${day}/${month}/${year}`;
}

export function convertTimestampToDatetimeLocalWithoutTime(firestoreTimestamp: any) {
  let date;

  // Kiểm tra nếu là đối tượng Firestore.Timestamp
  if (firestoreTimestamp.seconds !== undefined) {
      // Chuyển đổi từ Firestore.Timestamp sang Date
      date = new Date(firestoreTimestamp.seconds * 1000);
  } else if (typeof firestoreTimestamp === "number") {
      // Nếu là Unix timestamp (số giây), chuyển đổi sang Date
      date = new Date(firestoreTimestamp * 1000);
  } else {
      throw new Error("Invalid timestamp format");
  }

  // Lấy các thành phần cần thiết
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Kết hợp thành chuỗi theo định dạng "YYYY-MM-DD"
  return `${year}-${month}-${day}`;
}

export function formatISOString(isoString: any) {
  const date = new Date(isoString);

  // Lấy giờ và phút
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Lấy ngày, tháng, năm
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  // Kết hợp thành chuỗi định dạng
  return `${hours}:${minutes}, ${day}/${month}/${year}`;
}
