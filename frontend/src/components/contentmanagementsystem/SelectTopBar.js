import React from "react";

const SelectTopBar = ({
  selectedCards,
  onDelete,
  onStar,
  onSelectAll,
  onCancel,
}) => {
  return (
    <div className="pb-2 text-black flex border-b-2  flex-row w-full justify-between items-center z-10 relative">
      {/* Cancel button */}
      <button
        className="max-w-12 flex flex-row justify-center basis-1/12 ml-4 mr-4 py-3 bg-gray-500 font-bold text-white rounded-lg hover:bg-gray-400 active:bg-gray-300 transition active:duration-100 duration-500 "
        onClick={onCancel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className=" basis-1/12 " />

      {/* Selected cards count */}
      <span className="basis-2/12  ml-36 mr-96 font-semibold text-xl">
        {selectedCards.length} card(s) selected
      </span>

      <div className=" basis-5/12 " />
      {/* Action buttons */}
      {/* <div className="basis-3/12 flex space-x-4"> */}

      {/* Delete button */}
      <button
        className="max-w-12 flex ml-32 justify-center basis-1/12 py-3 bg-red-500 font-bold text-white rounded-lg hover:bg-red-400 active:bg-red-300 active:duration-100 transition duration-500  "
        onClick={onDelete}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>

      {/* Star button */}
      <button
        className="max-w-12 flex ml-4 justify-center basis-1/12  py-3 bg-yellow-400 font-bold text-white rounded-lg hover:bg-yellow-300 active:bg-yellow-200 active:duration-100 transition duration-500  "
        onClick={onStar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      </button>

      {/* Select All button */}
      <button
        className="max-w-12 flex ml-4 mr-4 justify-center  basis-1/12  py-3 bg-green-500 font-bold text-white rounded-lg hover:bg-green-400 active:duration-100 active:bg-green-300 transition duration-500   "
        onClick={onSelectAll}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
          />
        </svg>
      </button>
    </div>
    // </div>
  );
};

export default SelectTopBar;
