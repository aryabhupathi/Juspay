

  import React, { useState } from "react";
import { useSprite } from "./SpriteContext";
import CatSprite from "./CatSprite";
import DogSprite from "./DogSprite";

export default function MidArea() {
  const spriteOptions = [
    { name: "Cat", component: CatSprite },
    { name: "Dog", component: DogSprite },
  ];

  const [dropdownValue, setDropdownValue] = useState("");
  const [selectedSprites, setSelectedSprites] = useState([]); // ✅ Correct state for multiple sprites
  const [blocks, setBlocks] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const { move, rotate, showMessage, setIsDraggable } = useSprite();

  const handleSpriteSelect = (e) => {
    const value = e.target.value;
    setDropdownValue(value);

    const selected = spriteOptions.find((s) => s.name === value);
    if (selected && !selectedSprites.includes(selected.component)) {
      setSelectedSprites((prev) => [...prev, selected.component]);
    }

    // Reset dropdown to allow re-selection of the same sprite later
    setTimeout(() => setDropdownValue(""), 0);
  };

  const handleDrop = (e) => {
    const blockType = e.dataTransfer.getData("blockType");
    setBlocks((prev) => [...prev, blockType]);
  };

  const handleBlockClick = (idx) => {
    setBlocks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRun = async () => {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block === "repeat") {
        const prevBlock = blocks[i - 1];
        if (!prevBlock) continue;
        for (let j = 0; j < 10; j++) {
          await runBlock(prevBlock);
          await new Promise((res) => setTimeout(res, 100));
        }
      } else {
        await runBlock(block);
        await new Promise((res) => setTimeout(res, 300));
      }
    }
    setHasRun(true);
  };

  const runBlock = async (block) => {
    switch (block) {
      case "move_steps":
        move(10);
        break;
      case "Turn 30 degrees anti clockwise":
        rotate(-30);
        break;
      case "Turn 30 degrees clockwise":
        rotate(30);
        break;
      case "say":
        showMessage("saying");
        break;
      case "think":
        showMessage("thinking");
        break;
      case "when_sprite_clicked":
        setIsDraggable(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-gray-100">
      {/* Script Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full lg:w-2/3 p-6 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Script Blocks</h2>
          <button
            disabled={blocks.length === 0}
            onClick={() => {
              if (hasRun) {
                setBlocks([]);
                setHasRun(false);
              } else {
                handleRun();
                setHasRun(true);
              }
            }}
            className={`px-5 py-2 rounded font-semibold text-white transition duration-200
              ${blocks.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : hasRun
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
              }`}
          >
            {hasRun ? "Reset" : "Run"}
          </button>
        </div>

        <div className="space-y-3">
          {blocks.length > 0 ? (
            blocks.map((block, idx) => (
              <div
                key={idx}
                onClick={() => handleBlockClick(idx)}
                title="Click to remove"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-300 shadow-sm cursor-pointer transition"
              >
                {block}
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">
              Drag and drop blocks here to start building a script.
            </p>
          )}
        </div>
      </div>

      {/* Sprite Panel */}
      <div className="w-full lg:w-1/3 p-6 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Sprite</h2>

        <select
          className="p-2 w-full border border-gray-300 rounded mb-6 bg-white text-gray-800"
          value={dropdownValue}
          onChange={handleSpriteSelect}
        >
          <option value="">Select a sprite</option>
          {spriteOptions.map((sprite) => (
            <option key={sprite.name} value={sprite.name}>
              {sprite.name}
            </option>
          ))}
        </select>

        <div className="w-full h-64 border-2 border-dashed border-red-400 rounded-lg flex items-center justify-center bg-white">
          {selectedSprites.length > 0 ? (
            <div className="flex gap-4">
              {selectedSprites.map((SpriteComp, idx) => (
                <SpriteComp key={idx} className="h-40 w-auto" />
              ))}
            </div>
          ) : (
            <span className="text-gray-400">No sprite selected</span>
          )}
        </div>
      </div>
    </div>
  );
}

