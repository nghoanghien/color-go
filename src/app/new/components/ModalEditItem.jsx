import React from 'react';
import { FiX } from "react-icons/fi";

const ModalEditItem = ({ isEditModalOpen, setIsEditModalOpen, editItem, setEditItem, handleEditSubmit, categories }) => {
  return (
    isEditModalOpen && editItem && (
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
              <label className="block mb-1">Tên sản phẩm</label>
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
              <label className="block mb-1">Danh Mục</label>
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
              <label className="block mb-1">Số lượng</label>
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
              <label className="block mb-1">Giá</label>
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
              <label className="block mb-1">Mô tả</label>
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
    )
  );
};

export default ModalEditItem; 