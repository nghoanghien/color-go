import React from 'react';
import { FiX } from "react-icons/fi";

const ModalAddItem = ({ isModalOpen, setIsModalOpen, newItem, setNewItem, handleModalSubmit, categories }) => {
  return (
    isModalOpen && (
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
    )
  );
};

export default ModalAddItem; 