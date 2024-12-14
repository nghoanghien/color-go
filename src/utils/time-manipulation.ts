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