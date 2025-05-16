import React, { useState } from "react";
const blocks = [
  {
    category: "Motion",
    color: "bg-blue-500",
    items: [
      { label: ["Move X"], type: "MoveX" },
      { label: ["Move Y"], type: "MoveY" },
      { label: ["Rotate"], type: "Rotate" },
      { label: ["Move Random"], type: "Random" },
    ],
  },
  {
    category: "Looks",
    color: "bg-purple-500",
    items: [
      { label: ["Say Something"], type: "Say" },
      { label: ["Think Something"], type: "Think" },
    ],
  },
  {
    category: "Control",
    color: "bg-red-500",
    items: [{ label: ["Repeat"], type: "Repeat" }],
  },
];
export default function Sidebar() {
  const [openCategories, setOpenCategories] = useState(() => {
    const initialState = {};
    blocks.forEach((block) => {
      initialState[block.category] = true;
    });
    return initialState;
  });
  const toggleCategory = (cat) => {
    setOpenCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };
  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData("blockType", blockType);
  };
  return (
    <div className="w-100 flex-none h-full overflow-y-auto p-3 border-r border-gray-200 bg-gray-50">
      {blocks.map(({ category, color, items }) => (
        <div key={category} className="mb-4 border rounded bg-white shadow-sm">
          <div
            className="cursor-pointer px-3 py-2 font-semibold text-gray-700 bg-gray-200 flex justify-between items-center hover:bg-gray-300 transition"
            onClick={() => toggleCategory(category)}
          >
            <span>{category}</span>
            <span className="text-gray-600 text-xs">
              {openCategories[category] ? "−" : "+"}
            </span>
          </div>
          {openCategories[category] && (
            <div className="px-2 py-2">
              {items.map(({ label, type }, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, type)}
                  className={`flex flex-wrap items-center ${color} text-white px-2 py-1 my-1 text-sm cursor-pointer rounded shadow hover:brightness-110 transition-all`}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
