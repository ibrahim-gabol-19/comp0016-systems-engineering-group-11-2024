import React from "react";

const Button = ({ text, href }) => {
  return (
    <div>
      <a
        href={href}
        className="px-4 sm:px-6 py-2 rounded-full text-red-500 border-2 border-red-500 font-semibold hover:bg-red-500 hover:text-black transition hover:shadow-[0_0_15px_3px_rgba(255,0,0,0.8)"
      >
        {text}
      </a>
    </div>
  );
};

export default Button;
