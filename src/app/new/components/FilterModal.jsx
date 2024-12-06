import React from 'react';
import { FiX } from "react-icons/fi";

const FilterModal = ({ filterModalOpen, setFilterModalOpen, filterCriteria, setFilterCriteria, applyFilters, categories }) => {
  return (
    filterModalOpen && (
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
    )
  );
};

export default FilterModal; 