import React from 'react';
import { FiTrash2, FiEdit2, FiRotateCcw } from "react-icons/fi";

const InventoryTable = ({ inventory, handleRowClick, handleDeleteInventoryItem, handleEditClick, handleUndoDelete, deletedItems }) => {
  return (
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
                  className="text-red-600 mr-5"
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
  );
};

export default InventoryTable; 