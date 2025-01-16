import React, { useEffect, useState } from "react";

const SidebarReport = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full bg-green-500 h-1/6">
        {/*Title*/}
        <div className="w-full h-3/4 bg-green-200 ml-4"> </div>
        {/*Status*/}
        <div className="w-full h-1/4 bg-green-100 ml-4"> </div>
      </div>
      {/*Image*/}
      <div className="w-full bg-blue-500 h-2/6"></div>
      {/*Description*/} {/*Include the poster at the bottom */}
      <div className="w-full bg-blue-100 h-2/6">
      </div>
      {/*Upvote*/}
      <div className="w-full bg-red-100 h-1/6"></div>
    </div>
  );
};

export default SidebarReport;
