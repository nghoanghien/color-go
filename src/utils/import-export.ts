import * as XLSX from "xlsx";


export const readExcelFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Lấy file từ input
    if (!file) {
      alert('Không có file được chọn!');
      return;
    }
 
    const reader = new FileReader();
 
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer); // Chuyển đổi ArrayBuffer thành Uint8Array
      const workbook = XLSX.read(data, { type: 'array' }); // Đọc workbook từ data (kiểu array)
 
      const firstSheetName = workbook.SheetNames[0]; // Lấy tên sheet đầu tiên
      const worksheet = workbook.Sheets[firstSheetName]; // Lấy worksheet đầu tiên
      const importedData = XLSX.utils.sheet_to_json(worksheet); // Chuyển worksheet thành mảng object
 
      // Console log dữ liệu đọc được
      console.log(importedData);
    };
 
    // Đọc file dưới dạng ArrayBuffer
    reader.readAsArrayBuffer(file);
  };
 
