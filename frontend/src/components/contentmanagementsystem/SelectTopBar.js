import React from "react";

const SelectTopBar = ({ selectedCards, onDelete, onStar, onSelectAll, onCancel }) => {
  return (
    <div className="bg-gray-800 text-white py-2 px-4 flex justify-between items-center z-10">
      {/* Selected cards count */}
      <span className="font-semibold text-lg">{selectedCards.length} card(s) selected</span>

      {/* Action buttons */}
      <div className="flex space-x-4">
        {/* Delete button */}
        <button
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={onDelete}
        >
          Delete
        </button>

        {/* Star button */}
        <button
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onClick={onStar}
        >
          Star
        </button>

        {/* Select All button */}
        <button
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={onSelectAll}
        >
          Select All
        </button>

        {/* Cancel button */}
        <button
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SelectTopBar;
