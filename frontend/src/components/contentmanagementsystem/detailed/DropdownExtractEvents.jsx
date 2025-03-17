import React, { useState, useRef, useEffect } from 'react';

function DropdownExtract({ handleExtractFromPDFClick, handleExtractFromICSClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="bg-purple-500 text-white justify-center font-bold rounded-lg hover:bg-purple-400 active:bg-purple-300 transition active:duration-100 duration-300 px-4 py-2"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          Extract From...
        </button>
      </div>

      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex="-1"
      >
        <div className="py-1" role="none">
          <button
            onClick={() => {
              handleExtractFromPDFClick();
              setIsOpen(false);
            }}
            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
          >
            Extract From PDF
          </button>
          <button
            onClick={() => {
              handleExtractFromICSClick();
              setIsOpen(false);
            }}
            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-1"
          >
            Extract From ICS
          </button>
        </div>
      </div>
    </div>
  );
}

export default DropdownExtract;