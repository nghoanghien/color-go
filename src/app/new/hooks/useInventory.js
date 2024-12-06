import { useState, useCallback } from "react";
import * as XLSX from 'xlsx';

const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [productHistory, setProductHistory] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const requiredColumns = ['Tên sản phẩm', 'SL', 'Giá', 'Danh mục', 'Mô tả'];
      const missingColumns = requiredColumns.filter(col => !jsonData.every(item => item[col] !== undefined));

      if (missingColumns.length > 0) {
        setErrorMessage(`Không tìm thấy các cột: ${missingColumns.join(', ')}`);
        return;
      }

      setErrorMessage("");

      jsonData.forEach(item => {
        const productName = item['Tên sản phẩm'];
        const existingItem = inventory.find(i => i.productName === productName);

        const quantity = item['SL'] || 0;
        const price = item['Giá'] || 0;

        if (existingItem) {
          existingItem.quantity = parseInt(existingItem.quantity) + parseInt(quantity);
          existingItem.price = (parseFloat(existingItem.price) + parseFloat(price)) / 2;
          setInventory(prev => prev.map(item => {
            if (item.productName === productName) {
              return {
                ...item,
                quantity: existingItem.quantity,
                price: existingItem.price
              };
            }
            return item;
          }));
        } else {
          setInventory(prev => [...prev, {
            productName: productName,
            category: item['Danh mục'],
            quantity: quantity,
            price: price,
            description: item['Mô tả'] || ""
          }]);
        }

        const historyEntry = {
          productName: productName,
          quantity: quantity,
          price: price,
          timestamp: new Date().toISOString(),
          action: "add"
        };

        setProductHistory(prev => ({
          ...prev,
          [productName]: [...(prev[productName] || []), historyEntry]
        }));
      });
    };

    reader.readAsArrayBuffer(file);
  }, [inventory]);

  return {
    inventory,
    setInventory,
    productHistory,
    setProductHistory,
    errorMessage,
    setErrorMessage,
    onDrop
  };
};

export default useInventory; 