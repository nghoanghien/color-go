import React from 'react';
import { FiX } from "react-icons/fi";

const ModalDetails = ({ isDetailsModalOpen, setIsDetailsModalOpen, selectedItem, productHistory }) => {
  return (
    isDetailsModalOpen && selectedItem && (
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
    )
  );
};

export default ModalDetails; 