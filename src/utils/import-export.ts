import * as XLSX from "xlsx";


export const readExcelFile = (input: any): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const file = input?.[0]; // Lấy file từ input
    if (!file) {
      alert('Không có file được chọn!');
      reject(new Error('Không có file được chọn!'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer); // Chuyển ArrayBuffer thành Uint8Array
        const workbook = XLSX.read(data, { type: 'array' }); // Đọc workbook từ data

        const firstSheetName = workbook.SheetNames[0]; // Lấy tên sheet đầu tiên
        const worksheet = workbook.Sheets[firstSheetName]; // Lấy worksheet đầu tiên
        const importedData = XLSX.utils.sheet_to_json(worksheet); // Chuyển worksheet thành mảng object

        resolve(importedData); // Trả về dữ liệu
      } catch (error) {
        reject(error); // Xử lý lỗi
      }
    };

    reader.onerror = (error) => {
      reject(error); // Xử lý lỗi đọc file
    };

    // Đọc file dưới dạng ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
};

 
