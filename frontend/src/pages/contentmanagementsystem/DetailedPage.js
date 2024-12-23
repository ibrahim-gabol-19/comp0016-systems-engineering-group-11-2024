// import React, { useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import Editor from "../../components/contentmanagementsystem/detailed/Editor";
// import Quill, { Delta } from "quill";

// const DetailedPage = () => {
//   const quillRef = useRef(); // Ref for the Quill container
//   const quillRefTitle = useRef();
//   const { category, index } = useParams();
//   const [isEditing, setIsEditing] = useState(true); // State to toggle between edit and preview mode

//   const sampleData = {
//     Forum: [
//       {
//         title: "Big Ben",
//         openTimes: "9:00 AM - 6:00 PM",
//         description: "Iconic clock tower located in London.",
//         image: "https://via.placeholder.com/150",
//       },
//       {
//         title: "Tower of London",
//         openTimes: "10:00 AM - 5:30 PM",
//         description: "Historic castle on the River Thames.",
//         image: "https://via.placeholder.com/150",
//       },
//       {
//         title: "London Eye",
//         openTimes: "10:00 AM - 8:00 PM",
//         description: "Famous observation wheel offering panoramic views.",
//         image: "https://via.placeholder.com/150",
//       },
//       {
//         title: "The Shard",
//         openTimes: "9:00 AM - 10:00 PM",
//         description: "Tallest building in London with an observation deck.",
//         image: "https://via.placeholder.com/150",
//       },
//     ],
//     Reporting: [
//       {
//         title: "British Museum",
//         openTimes: "10:00 AM - 6:00 PM",
//         description: "Explore world history and culture.",
//         image: "https://via.placeholder.com/150",
//       },
//     ],
//     Events: [
//       {
//         title: "Hyde Park",
//         openTimes: "Open 24 hours",
//         description: "Relax in one of London's largest parks.",
//         image: "https://via.placeholder.com/150",
//       },
//     ],
//     News: [
//       {
//         title: "Camden Market",
//         openTimes: "10:00 AM - 7:00 PM",
//         description: "Browse eclectic shops and food stalls.",
//         image: "https://via.placeholder.com/150",
//       },
//     ],
//   };

//   const cardData = sampleData[category]?.[index];

//   if (!cardData) {
//     return <div>Card not found</div>;
//   }

//   // Default Content for the editor
//   const defaultValue = new Delta();
//   defaultValue.insert(`${cardData.title}\n`, { bold: true, header: 1 }); // Insert a header for the title

//   defaultValue.insert(`${cardData.openTimes}\n\n`, { header: 3 }); // Insert a header for the open times
//   defaultValue.insert(`${cardData.description}\n`, {}); // Insert the description text
//   if (cardData.image) {
//     defaultValue.insert({ image: cardData.image }); // Add image
//   }

//   return (
//     <div>
//       {/* Toggle between edit and preview */}
//       <div className="p-6">
//         <button
//           onClick={() => setIsEditing((prev) => !prev)}
//           className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
//         >
//           {isEditing ? "Switch to Preview" : "Switch to Edit"}
//         </button>
//         {/* Non-functional save button */}
//         <button className="bg-green-500 text-white px-4 py-2 rounded">
//           Save
//         </button>
//       </div>

//       {/* Full-screen container */}
//       <div className="w-screen h-screen flex justify-center items-center overflow-hidden relative">
//         {/* Conditionally render either editor or preview */}
//         {isEditing ? (
//           <div>
//             <div className="">
//               <Editor
//                 ref={quillRef}
//                 defaultValue={defaultValue}
//                 style={{
//                   width: "100%", // Ensure the editor takes up the full width of its container
//                   height: "100%", // Ensure the editor takes up the full height of its container
//                 }}
//               />
//             </div>
//             <div className=" ">
//               <Editor
//                 ref={quillRefTitle}
//                 style={{
//                   width: "100%", // Ensure the editor takes up the full width of its container
//                   height: "100%", // Ensure the editor takes up the full height of its container
//                 }}
//               />
//             </div>
              
//           </div>
//         ) : (
//           <div className="w-1/2 h-4/5 overflow-auto p-4 bg-gray-100 rounded">
//             {/* Card Details (Preview Mode) */}
//             <h1 className="text-3xl font-bold">{cardData.title}</h1>
//             <p className="">{cardData.openTimes}</p>
//             <p className="mt-4">{cardData.description}</p>
//             {cardData.image && (
//               <img src={cardData.image} alt={cardData.title} />
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DetailedPage;
