'use client';

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from 'xlsx';
import { FiUploadCloud } from "react-icons/fi";
import InventoryTable from './components/InventoryTable';
import ModalAddItem from './components/ModalAddItem';
import ModalEditItem from './components/ModalEditItem';
import ModalDetails from './components/ModalDetails';
import FilterModal from './components/FilterModal';
import jsPDF from 'jspdf';
//import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

const WarehouseManager = () => {
  const [activeTab, setActiveTab] = useState("warehouse");
  const [files, setFiles] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    productName: "",
    category: "",
    quantity: "",
    price: "",
    description: ""
  });
  const [inventory, setInventory] = useState([]);
  const [productHistory, setProductHistory] = useState({});
  
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    categories: [],
    quantityRange: [0, 100],
    priceRange: [0, 1000],
    entryDateRange: [null, null]
  });
  const [filteredInventory, setFilteredInventory] = useState(inventory);

  const categories = [
    "Bàn phím",
    "Chuột máy tính",
    "Tai nghe",
    "Loa",
    "Dây sạc"
  ];

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
            const existingItem = inventory.find(i => i.productName == productName);

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
  }, [inventory, setInventory, setProductHistory]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (newItem.productName && newItem.category && newItem.quantity && newItem.price) {
      const timestamp = new Date().toISOString();
      const historyEntry = {
        ...newItem,
        timestamp,
        action: "add"
      };

      const existingItem = inventory.find(item => item.productName == newItem.productName);
      if (existingItem) {
        setInventory(prev => prev.map(item => {
          if (item.productName == newItem.productName) {
            return {
              ...item,
              quantity: parseInt(item.quantity) + parseInt(newItem.quantity),
              price: parseFloat(newItem.price),
              description: newItem.description
            };
          }
          return item;
        }));
      } else {
        setInventory(prev => [...prev, { ...newItem }]);
      }

      setProductHistory(prev => ({
        ...prev,
        [newItem.productName]: [...(prev[newItem.productName] || []), historyEntry]
      }));

      setNewItem({
        productName: "",
        category: "",
        quantity: "",
        price: "",
        description: ""
      });
      setIsModalOpen(false);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const historyEntry = {
      ...editItem,
      timestamp,
      action: "edit"
    };

    setInventory(prev => prev.map(item => 
      item.productName === editItem.productName ? editItem : item
    ));

    setProductHistory(prev => ({
      ...prev,
      [editItem.productName]: [...(prev[editItem.productName] || []), historyEntry]
    }));

    setIsEditModalOpen(false);
    setEditItem(null);
  };

  const handleEditClick = (e, item) => {
    e.stopPropagation();
    setEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteInventoryItem = (item) => {
    const historyEntry = {
      ...item,
      timestamp: new Date().toISOString(),
      action: "delete"
    };

    setProductHistory(prev => ({
      ...prev,
      [item.productName]: [...(prev[item.productName] || []), historyEntry]
    }));

    setDeletedItems((prev) => [...prev, item]);
    setInventory((prev) => prev.filter(i => i !== item));
  };

  const handleUndoDelete = () => {
    if (deletedItems.length > 0) {
      const lastDeleted = deletedItems[deletedItems.length - 1];
      const historyEntry = {
        ...lastDeleted,
        timestamp: new Date().toISOString(),
        action: "restore"
      };

      setProductHistory(prev => ({
        ...prev,
        [lastDeleted.productName]: [...(prev[lastDeleted.productName] || []), historyEntry]
      }));

      setInventory((prev) => [...prev, lastDeleted]);
      setDeletedItems((prev) => prev.slice(0, -1));
    }
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const exportToExcel = () => {
    const filteredData = filteredInventory.map(item => ({
        'Tên Sản Phẩm': item.productName,
        'Danh Mục': item.category,
        'Số Lượng Tồn Kho': item.quantity,
        'Giá Tiền': item.price
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory.xlsx");
  };

  const applyFilters = () => {
    let filtered = inventory;

    if (filterCriteria.categories.length > 0) {
      filtered = filtered.filter(item => filterCriteria.categories.includes(item.category));
    }

    filtered = filtered.filter(item => 
      item.quantity >= filterCriteria.quantityRange[0] && item.quantity <= filterCriteria.quantityRange[1]
    );

    filtered = filtered.filter(item => 
      item.price >= filterCriteria.priceRange[0] && item.price <= filterCriteria.priceRange[1]
    );

    if (filterCriteria.entryDateRange[0] && filterCriteria.entryDateRange[1]) {
      filtered = filtered.filter(item => {
        const entryDate = new Date(item.entryDate);
        return entryDate >= new Date(filterCriteria.entryDateRange[0]) && entryDate <= new Date(filterCriteria.entryDateRange[1]);
      });
    }

    setFilteredInventory(filtered);
    setFilterModalOpen(false);
  };

  const exportToWord = () => {
    const blob = new Blob([`
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Inventory Report</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid black; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Báo cáo sản phẩm</h1>
                <table>
                    <tr>
                        <th>Tên Sản Phẩm</th>
                        <th>Danh Mục</th>
                        <th>Số Lượng Tồn Kho</th>
                        <th>Giá Tiền</th>
                    </tr>
                    ${filteredInventory.map(item => `
                        <tr>
                            <td>${item.productName}</td>
                            <td>${item.category}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
        </html>
    `], {
        type: 'application/msword'
    });
    saveAs(blob, 'inventory.doc');
  };

  useEffect(() => {
    if (activeTab === "reports") {
      setFilteredInventory(inventory);
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      <div className="mb-6 border-b">
        <nav className="flex justify-center space-x-4">
          <button onClick={() => setActiveTab("warehouse")} className={`px-4 py-2 ${activeTab === "warehouse" ? "border-b-2 border-blue-500" : ""}`}>
            Quản Lý Kho
          </button>
          <button onClick={() => setActiveTab("reports")} className={`px-4 py-2 ${activeTab === "reports" ? "border-b-2 border-blue-500" : ""}`}>
            Báo Cáo
          </button>
        </nav>
      </div>

      {activeTab === "warehouse" && (
        <>
          <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"}`}>
            <input {...getInputProps()} />
            <FiUploadCloud className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Kéo & thả tệp dữ liệu kho vào đây, hoặc nhấp để chọn tệp</p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thêm Dữ Liệu
            </button>
          </div>

          <InventoryTable 
            inventory={inventory} 
            handleRowClick={handleRowClick} 
            handleDeleteInventoryItem={handleDeleteInventoryItem} 
            handleEditClick={handleEditClick} 
            handleUndoDelete={handleUndoDelete} 
            deletedItems={deletedItems} 
          />
          <ModalAddItem 
            isModalOpen={isModalOpen} 
            setIsModalOpen={setIsModalOpen} 
            newItem={newItem} 
            setNewItem={setNewItem} 
            handleModalSubmit={handleModalSubmit} 
            categories={categories} 
          />
          <ModalEditItem 
            isEditModalOpen={isEditModalOpen} 
            setIsEditModalOpen={setIsEditModalOpen} 
            editItem={editItem} 
            setEditItem={setEditItem} 
            handleEditSubmit={handleEditSubmit} 
            categories={categories} 
          />
          <ModalDetails 
            isDetailsModalOpen={isDetailsModalOpen} 
            setIsDetailsModalOpen={setIsDetailsModalOpen} 
            selectedItem={selectedItem} 
            productHistory={productHistory} 
          />    
        </>
      )}

      {activeTab === "reports" && (
        <>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 inline-block">Danh Sách Hàng Hóa</h3>
            <button onClick={() => setFilterModalOpen(true)} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Bộ lọc
            </button>
            <button onClick={exportToExcel} className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Xuất Excel
            </button>
            <button onClick={exportToWord} className="ml-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              Xuất Word
            </button>
            <table className="w-full mt-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Sản Phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh Mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Lượng Tồn Kho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá Tiền</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map(item => (
                  <tr key={item.productName} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <FilterModal 
            filterModalOpen={filterModalOpen} 
            setFilterModalOpen={setFilterModalOpen} 
            filterCriteria={filterCriteria} 
            setFilterCriteria={setFilterCriteria} 
            applyFilters={applyFilters} 
            categories={categories} 
          />
        </>
      )}
    </div>
  );
};

export default WarehouseManager;