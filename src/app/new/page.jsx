'use client';

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiEdit2, FiTrash2, FiSearch, FiFilter, FiRotateCcw, FiX } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
import * as XLSX from 'xlsx';

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
  
  // Thêm các state cho tab "Báo cáo"
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

        // Chuyển đổi sheet thành JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Kiểm tra sự tồn tại của các cột cần thiết
        const requiredColumns = ['Tên sản phẩm', 'SL', 'Giá', 'Danh mục', 'Mô tả'];
        const missingColumns = requiredColumns.filter(col => !jsonData.every(item => item[col] !== undefined));

        if (missingColumns.length > 0) {
            setErrorMessage(`Không tìm thấy các cột: ${missingColumns.join(', ')}`);
            return; // Dừng lại nếu có cột thiếu
        }

        setErrorMessage("");

        // Cập nhật kho với dữ liệu mới
        jsonData.forEach(item => {
            const productName = item['Tên sản phẩm'];
            const existingItem = inventory.find(i => i.productName == productName);

            const quantity = item['SL'] || 0;
            const price = item['Giá'] || 0;

            if (existingItem) {
                // Nếu sản phẩm đã tồn tại, cập nhật số lượng và giá
                existingItem.quantity = parseInt(existingItem.quantity) + parseInt(quantity);
                existingItem.price = (parseFloat(existingItem.price) + parseFloat(price)) / 2; // Tính giá trung bình
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
                // Nếu sản phẩm chưa tồn tại, thêm mới
                setInventory(prev => [...prev, {
                    productName: productName,
                    category: item['Danh mục'],
                    quantity: quantity,
                    price: price,
                    description: item['Mô tả'] || ""
                }]);
            }

            // Lưu vào lịch sử
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

  // Hàm xuất bảng ra file excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredInventory); // Chuyển đổi dữ liệu thành worksheet
    const workbook = XLSX.utils.book_new(); // Tạo workbook mới
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory"); // Thêm worksheet vào workbook

    // Xuất file
    XLSX.writeFile(workbook, "inventory.xlsx"); // Tải xuống file
  };

  const applyFilters = () => {
    let filtered = inventory;

    // Lọc theo danh mục
    if (filterCriteria.categories.length > 0) {
      filtered = filtered.filter(item => filterCriteria.categories.includes(item.category));
    }

    // Lọc theo số lượng tồn kho
    filtered = filtered.filter(item => 
      item.quantity >= filterCriteria.quantityRange[0] && item.quantity <= filterCriteria.quantityRange[1]
    );

    // Lọc theo giá tiền
    filtered = filtered.filter(item => 
      item.price >= filterCriteria.priceRange[0] && item.price <= filterCriteria.priceRange[1]
    );

    // Lọc theo ngày nhập
    if (filterCriteria.entryDateRange[0] && filterCriteria.entryDateRange[1]) {
      filtered = filtered.filter(item => {
        const entryDate = new Date(item.entryDate);
        return entryDate >= new Date(filterCriteria.entryDateRange[0]) && entryDate <= new Date(filterCriteria.entryDateRange[1]);
      });
    }

    setFilteredInventory(filtered);
    setFilterModalOpen(false);
  };

  useEffect(() => {
    if (activeTab === "reports") {
      setFilteredInventory(inventory); // Cập nhật filteredInventory với dữ liệu từ inventory khi vào tab "Báo cáo"
    }
  }, [activeTab, inventory]);

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

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full transform transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Thêm Sản Phẩm Mới</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleModalSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Tên sản phẩm"
                      value={newItem.productName}
                      onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Chọn Danh Mục</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Số lượng"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Giá"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Mô tả"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                  >
                    Thêm vào kho
                  </button>
                </form>
              </div>
            </div>
          )}

          {isEditModalOpen && editItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full transform transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Sửa Thông Tin Sản Phẩm</h3>
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditItem(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Tên sản phẩm"
                      value={editItem.productName}
                      onChange={(e) => setEditItem({ ...editItem, productName: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <select
                      value={editItem.category}
                      onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Chọn Danh Mục</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Số lượng"
                      value={editItem.quantity}
                      onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Giá"
                      value={editItem.price}
                      onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Mô tả"
                      value={editItem.description}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                  >
                    Lưu thay đổi
                  </button>
                </form>
              </div>
            </div>
          )}

          {isDetailsModalOpen && selectedItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">{selectedItem.productName}</h3>
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h4>
                  <p className="text-gray-600">{selectedItem.description || "Không có mô tả"}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Lịch sử sản phẩm</h4>
                  <div className="space-y-4">
                    {productHistory[selectedItem.productName]?.map((entry, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {entry.action === "add" && "Thêm mới"}
                            {entry.action === "delete" && "Xóa"}
                            {entry.action === "restore" && "Khôi phục"}
                            {entry.action === "edit" && "Chỉnh sửa"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Số lượng: {entry.quantity}</p>
                          <p>Giá: {entry.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Danh Sách Hàng Hóa</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Sản Phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh Mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Lượng Tồn Kho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá Tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map(item => (
                  <tr 
                    key={item.productName}
                    onClick={() => handleRowClick(item)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteInventoryItem(item);
                        }} 
                        className="text-red-600"
                      >
                        <FiTrash2 />
                      </button>
                      <button 
                        onClick={(e) => handleEditClick(e, item)} 
                        className="text-blue-600 ml-2"
                      >
                        <FiEdit2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {deletedItems.length > 0 && (
              <button onClick={handleUndoDelete} className="mt-4 flex items-center text-yellow-600 hover:text-yellow-700">
                <FiRotateCcw className="mr-1" />
                Hoàn Tác
              </button>
            )}
          </div>
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

          {filterModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full transform transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Bộ Lọc</h3>
                  <button onClick={() => setFilterModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Danh Mục</label>
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filterCriteria.categories.includes(category)}
                          onChange={() => {
                            const newCategories = filterCriteria.categories.includes(category)
                              ? filterCriteria.categories.filter(c => c !== category)
                              : [...filterCriteria.categories, category];
                            setFilterCriteria({ ...filterCriteria, categories: newCategories });
                          }}
                          className="mr-2"
                        />
                        <span>{category}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng tồn kho</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={filterCriteria.quantityRange[0]}
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, quantityRange: [e.target.value, filterCriteria.quantityRange[1]] })}
                        className="w-full border rounded px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder="Đến"
                        value={filterCriteria.quantityRange[1]}
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, quantityRange: [filterCriteria.quantityRange[0], e.target.value] })}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Ví dụ: 10 đến 100</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giá tiền</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={filterCriteria.priceRange[0]}
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, priceRange: [e.target.value, filterCriteria.priceRange[1]] })}
                        className="w-full border rounded px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder="Đến"
                        value={filterCriteria.priceRange[1]}
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, priceRange: [filterCriteria.priceRange[0], e.target.value] })}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Ví dụ: 100.000 đến 1.000.000</p>
                  </div>
                </div>
                <button onClick={applyFilters} className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors mt-4">
                  Áp Dụng
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WarehouseManager;
