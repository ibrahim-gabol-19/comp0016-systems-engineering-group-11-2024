import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";

const FilterForYouModal = ({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  initialSortOrder,
}) => {
  const [filters, setFilters] = useState(
    initialFilters || { forum: true, article: true, event: true, likedOnly: false }
  );
  const [sortOrder, setSortOrder] = useState(initialSortOrder || "newest");

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleApply = () => {
    onApply(filters, sortOrder);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaFilter /> Filter Posts
        </h2>

        <div className="mb-4">
          <p className="font-medium mb-2">Select Post Types:</p>
          <div className="flex items-center space-x-4 flex-wrap">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="forum"
                checked={filters.forum}
                onChange={handleCheckboxChange}
                className="mr-1"
              />
              Forum
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="article"
                checked={filters.article}
                onChange={handleCheckboxChange}
                className="mr-1"
              />
              Article
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="event"
                checked={filters.event}
                onChange={handleCheckboxChange}
                className="mr-1"
              />
              Event
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="likedOnly"
              checked={filters.likedOnly}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Show only liked posts
          </label>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-2">Sort By:</p>
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="w-full p-2 border rounded"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most_liked">Most Liked</option>
            <option value="most_commented">Most Commented</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterForYouModal;
