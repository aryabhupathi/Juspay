import React, { useState } from "react";
import { useSprite } from "./SpriteContext";
import CatSprite from "./CatSprite";
import DogSprite from "./DogSprite";
import BallSprite from "./BallSprite";
export default function MidArea({ selectedSprites, setSelectedSprites }) {
  const spriteOptions = [
    { name: "Cat", component: CatSprite },
    { name: "Dog", component: DogSprite },
    { name: "Ball", component: BallSprite },
  ];
  const [dropdownValue, setDropdownValue] = useState("");
  const { startAction, clearAction, activeActions } = useSprite();
  const handleSpriteSelect = (e) => {
    const value = e.target.value;
    if (!value) return;
    setDropdownValue(value);
    const selected = spriteOptions.find((s) => s.name === value);
    if (selected) {
      const count = selectedSprites.filter(
        (s) => s.baseName === selected.name
      ).length;
      const randomX = Math.floor(Math.random() * 150) + 50;
      const randomY = Math.floor(Math.random() * 150) + 50;
      setSelectedSprites((prev) => [
        ...prev,
        {
          id: `${selected.name}-${count + 1}`,
          name: `${selected.name} ${count + 1}`,
          baseName: selected.name,
          component: selected.component,
          blocks: [],
          hasRun: false,
          isPaused: false,
          state: {
            position: { x: randomX, y: randomY },
            rotation: 0,
            isDraggable: false,
          },
        },
      ]);
    }
    setTimeout(() => setDropdownValue(""), 0);
  };
  const handleDrop = (e, spriteId) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData("blockType");
    if (!blockType) return;
    setSelectedSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId
          ? { ...sprite, blocks: [...sprite.blocks, blockType] }
          : sprite
      )
    );
  };
  const handleBlockClick = (spriteId, blockIndex) => {
    setSelectedSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId
          ? {
              ...sprite,
              blocks: sprite.blocks.filter((_, i) => i !== blockIndex),
            }
          : sprite
      )
    );
  };
  const handleRunAll = () => {
    const promises = selectedSprites
      .filter((sprite) => sprite.blocks.length > 0 && !sprite.hasRun)
      .map((sprite) => handleRun(sprite.id));
    Promise.all(promises);
  };
  const handleRun = async (spriteId) => {
    const sprite = selectedSprites.find((s) => s.id === spriteId);
    if (!sprite || !sprite.actionRef) return;
    const actions = sprite.actionRef;
    actions.reset();
    setSelectedSprites((prev) =>
      prev.map((s) => (s.id === spriteId ? { ...s, hasRun: true } : s))
    );
    await executeBlocks(sprite.blocks, spriteId, actions);
  };
  const executeBlocks = async (blocks, spriteId, actions) => {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block === "repeat" && i > 0) {
        const previousBlock = blocks[i - 1];
        startAction(spriteId, `repeat: ${previousBlock}`);
        for (let j = 0; j < 5; j++) {
          if (isSpritePaused(spriteId)) {
            await waitForUnpause(spriteId);
          }
          await executeBlock(previousBlock, actions);
          await new Promise((res) => setTimeout(res, 300));
        }
        clearAction(spriteId);
        continue;
      }
      startAction(spriteId, block);
      if (isSpritePaused(spriteId)) {
        await waitForUnpause(spriteId);
      }
      await executeBlock(block, actions);
      await new Promise((res) => setTimeout(res, 300));
      clearAction(spriteId);
    }
  };
  const isSpritePaused = (spriteId) => {
    const sprite = selectedSprites.find((s) => s.id === spriteId);
    return sprite && sprite.actionRef && sprite.actionRef.isPaused;
  };
  const waitForUnpause = async (spriteId) => {
    return new Promise((resolve) => {
      const checkPaused = () => {
        if (!isSpritePaused(spriteId)) {
          resolve();
        } else {
          setTimeout(checkPaused, 100);
        }
      };
      checkPaused();
    });
  };
  const executeBlock = async (block, actions) => {
    const { move, rotate, showMessage, fliph, flipv } = actions;
    switch (block) {
      case "Move 10 steps forward":
        move(10);
        break;
      case "Move 10 steps backward":
        move(-10);
        break;
      case "Jump 30 steps forward":
        move(30);
        break;
      case "Jump 30 steps backward":
        move(-30);
        break;
      case "Turn 30 degrees anti clockwise":
        rotate(-30);
        break;
      case "Turn 30 degrees clockwise":
        rotate(30);
        break;
      case "say":
        showMessage("Hello ..");
        break;
      case "think":
        showMessage("Hmm.....");
        break;
      case "greet":
        showMessage("Good Day");
        break;
      case "bye":
        showMessage("See you later");
        break;
      case "fliph":
        fliph();
        break;
      case "flipv":
        flipv();
        break;
      default:
        break;
    }
  };
  const handleReset = (spriteId) => {
    const sprite = selectedSprites.find((s) => s.id === spriteId);
    if (!sprite || !sprite.actionRef) return;
    sprite.actionRef.reset();
    setSelectedSprites((prev) =>
      prev.map((s) =>
        s.id === spriteId ? { ...s, blocks: [], hasRun: false } : s
      )
    );
  };
  const handleTogglePause = (spriteId) => {
    const sprite = selectedSprites.find((s) => s.id === spriteId);
    if (!sprite || !sprite.actionRef) return;
    sprite.actionRef.togglePause();
    setSelectedSprites((prev) =>
      prev.map((s) => (s.id === spriteId ? { ...s, isPaused: !s.isPaused } : s))
    );
  };
  const getBlockStyle = (spriteId, block) => ({
    border: activeActions[spriteId] === block ? "2px solid green" : "none",
    boxShadow: activeActions[spriteId] === block ? "0 0 10px green" : "none",
    transition: "box-shadow 0.3s ease",
  });
  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="w-full p-6 bg-white overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add New Sprite
        </h2>
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
        <button
          onClick={handleRunAll}
          className="px-4 py-2 mb-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Run All
        </button>
        {selectedSprites.length > 0 ? (
          selectedSprites.map((sprite) => (
            <div
              key={sprite.id}
              className="mb-6 p-4 border border-gray-300 rounded bg-gray-50 shadow-sm"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, sprite.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {sprite.name}
                </h3>
                <div className="flex space-x-2">
                  {/* Pause/Play button */}
                  {sprite.hasRun && (
                    <button
                      onClick={() => handleTogglePause(sprite.id)}
                      className={`px-3 py-1 rounded text-white font-semibold transition ${
                        sprite.isPaused
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      {sprite.isPaused ? "Play" : "Pause"}
                    </button>
                  )}
                  {/* Run/Reset button */}
                  <button
                    disabled={sprite.blocks.length === 0}
                    onClick={() => {
                      if (sprite.hasRun) {
                        handleReset(sprite.id);
                      } else {
                        handleRun(sprite.id);
                      }
                    }}
                    className={`px-4 py-1 rounded text-white font-semibold transition ${
                      sprite.blocks.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : sprite.hasRun
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {sprite.hasRun ? "Reset" : "Run"}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {sprite.blocks.length > 0 ? (
                  sprite.blocks.map((block, blockIndex) => (
                    <div
                      key={blockIndex}
                      onClick={() => handleBlockClick(sprite.id, blockIndex)}
                      title="Click to remove"
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-300 shadow-sm cursor-pointer transition"
                      style={getBlockStyle(sprite.id, block)}
                    >
                      {block}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">
                    Drag blocks here for {sprite.name}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">
            No sprites yet. Select a sprite to get started.
          </p>
        )}
      </div>
    </div>
  );
}
