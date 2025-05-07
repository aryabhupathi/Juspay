  import React, { useState } from "react";
  import Icon from "./Icon";
  const blocks = [
    // {
    //   category: "Events",
    //   color: "bg-yellow-500",
    //   items: [
    //     {
    //       label: [
    //         "When ",
    //         <Icon
    //           key="flag"
    //           name="flag"
    //           size={15}
    //           className="text-green-600 mx-1"
    //         />,
    //         "clicked",
    //       ],
    //       type: "when_flag_clicked",
    //     },
    //     { label: ["When this sprite clicked"], type: "when_sprite_clicked" },
    //   ],
    // },
    {
      category: "Motion",
      color: "bg-blue-500",
      items: [
        { label: ["Move 10 steps forward"], type: "Move 10 steps forward" },
        
        { label: ["Move 10 steps backward"], type: "Move 10 steps backward" },
        {
          label: [
            "Turn ",
            <Icon key="undo" name="undo" size={15} className="mx-1" />,
            "30 degrees",
          ],
          type: "Turn 30 degrees anti clockwise",
        },
        {
          label: [
            "Turn ",
            <Icon key="redo" name="redo" size={15} className="mx-1" />,
            "30 degrees",
          ],
          type: "Turn 30 degrees clockwise",
        },
      ],
    },
    {
      category: "Looks",
      color: "bg-purple-500",
      items: [
        { label: ["Say 'Hello' for 2 seconds"], type: "say" },
        { label: ["Think 'Hmm...' for 2 seconds"], type: "think" },
      ],
    },
    {
      category: "Control",
      color: "bg-red-500",
      items: [{ label: ["Repeat 10 times"], type: "repeat" }],
    },
  ];
  export default function Sidebar() {
    const [openCategories, setOpenCategories] = useState(() =>
      Object.fromEntries(blocks.map((block) => [block.category, true]))
    );
    const toggleCategory = (category) => {
      setOpenCategories((prev) => ({
        ...prev,
        [category]: !prev[category],
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

