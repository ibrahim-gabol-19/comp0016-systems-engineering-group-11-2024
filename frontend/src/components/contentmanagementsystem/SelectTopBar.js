// TopBar.js
import React from "react";

const SelectTopBar = ({ selectedCards, onDelete, onStar, onSelectAll, onCancel }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white py-2 px-4 flex justify-between items-center z-10">
      <span>{selectedCards.length} card(s) selected</span>
      <div>
        <button
          className="mr-4 px-4 py-2 bg-red-500 rounded-lg"
          onClick={onDelete}
        >
          Delete
        </button>
        <button
          className="mr-4 px-4 py-2 bg-yellow-500 rounded-lg"
          onClick={onStar}
        >
          Star
        </button>
        <button
          className="mr-4 px-4 py-2 bg-green-500 rounded-lg"
          onClick={onSelectAll}
        >
          Select All
        </button>
        <button
          className="px-4 py-2 bg-gray-500 rounded-lg"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SelectTopBar;
