import React, { useState, useEffect, useCallback } from "react";
import { useSprite } from "../context/SpriteContext";
import CatSprite from "../components/sprites/CatSprite";
import DogSprite from "../components/sprites/DogSprite";
import BallSprite from "../components/sprites/BallSprite";
import { IndividualSpriteProvider } from "../context/ActionContext";
export default function MidArea({ selectedSprites, setSelectedSprites }) {
  const spriteOptions = [
    { name: "Cat", component: CatSprite },
    { name: "Dog", component: DogSprite },
    { name: "Ball", component: BallSprite },
  ];
  const [dropdownValue, setDropdownValue] = useState("");
  const { startAction, clearAction, activeActions, spritePositions } =
    useSprite();
  useEffect(() => {
    checkCollision();
  }, [spritePositions]);
  const [swappedPairs, setSwappedPairs] = useState(new Set());
  const checkCollision = useCallback(
    (id1, id2) => {
      const sprite1 = spritePositions[id1];
      const sprite2 = spritePositions[id2];
      if (!sprite1 || !sprite2) return false;
      const xOverlap =
        sprite1.x < sprite2.x + sprite2.width &&
        sprite1.x + sprite1.width > sprite2.x;
      const yOverlap =
        sprite1.y < sprite2.y + sprite2.height &&
        sprite1.y + sprite1.height > sprite2.y;
      const pairKey = [id1, id2].sort().join("__");
      if (xOverlap && yOverlap) {
        if (!swappedPairs.has(pairKey)) {
          swapAllBlocks(id1, id2);
          setSwappedPairs((prev) => new Set(prev).add(pairKey));
        }
        return true;
      } else {
        setSwappedPairs((prev) => {
          const updated = new Set(prev);
          updated.delete(pairKey);
          return updated;
        });
      }
      return false;
    },
    [spritePositions, swappedPairs]
  );
  const swapAllBlocks = (id1, id2) => {
    setSelectedSprites((prev) => {
      const spriteA = prev.find((s) => s.id === id1);
      const spriteB = prev.find((s) => s.id === id2);
      if (!spriteA || !spriteB) return prev;
      const updated = prev.map((sprite) => {
        if (sprite.id === id1) {
          return { ...sprite, blocks: spriteB.blocks };
        } else if (sprite.id === id2) {
          return { ...sprite, blocks: spriteA.blocks };
        } else {
          return sprite;
        }
      });
      return updated;
    });
  };
  const VERTICAL_SPACING = 80;
  const handleSpriteSelect = (e) => {
    const value = e.target.value;
    if (!value) return;
    setDropdownValue(value);
    const selected = spriteOptions.find((s) => s.name === value);
    if (selected) {
      const count = selectedSprites.filter(
        (s) => s.baseName === selected.name
      ).length;
      const yPosition = count * VERTICAL_SPACING;
      const randomX = Math.floor(Math.random() * 150) + 50;
      const newSprite = {
        id: `${selected.name}-${count + 1}`,
        name: `${selected.name} ${count + 1}`,
        baseName: selected.name,
        component: selected.component,
        blocks: [],
        hasRun: false,
        state: {
          position: { x: randomX, y: yPosition },
          rotation: 0,
          isDraggable: false,
          width: 120,
          height: 120,
        },
        actionRef: null,
      };
      setSelectedSprites((prev) => [...prev, newSprite]);
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
          ? {
              ...sprite,
              blocks: [...sprite.blocks, { type: blockType, values: {} }],
            }
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
  const executeBlocks = async (blocks, spriteId, actions) => {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.type === "Repeat") {
        const repeatTimes = Number(block.values.repeat);
        const prevBlock = blocks[i - 1];
        if (!prevBlock) continue;
        for (let j = 0; j < repeatTimes; j++) {
          startAction(spriteId, prevBlock.type);
          await executeBlock(prevBlock, actions);
          clearAction(spriteId);
          selectedSprites.forEach((otherSprite) => {
            if (otherSprite.id !== spriteId) {
              const isColliding = checkCollision(spriteId, otherSprite.id);
            }
          });
          await new Promise((res) => setTimeout(res, 300));
        }
        continue;
      }
      startAction(spriteId, block.type);
      await executeBlock(block, actions);
      clearAction(spriteId);
      if (block.type === "Move" || block.type === "Random") {
        selectedSprites.forEach((otherSprite) => {
          if (otherSprite.id !== spriteId) {
            const isColliding = checkCollision(spriteId, otherSprite.id);
          }
        });
      }
      await new Promise((res) => setTimeout(res, 300));
    }
  };
  const executeBlock = async (block, actions) => {
    const { move, rotate, say, think, repeat, randomXY, fliph, flipv } =
      actions;
    const { type, values = {} } = block;
    switch (type) {
      case "Move":
        move(Number(values.steps));
        break;
      case "Rotate":
        rotate(Number(values.degrees));
        break;
      case "Say":
        await say(values.message, Number(values.seconds));
        break;
      case "Think":
        await think(values.message, Number(values.seconds));
        break;
      case "Repeat":
        repeat(Number(values.times));
        break;
      case "Random":
        randomXY(Number(values.x), Number(values.y));
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
  const getBlockStyle = (spriteId, block) => ({
    border: activeActions[spriteId] === block.type ? "2px solid green" : "none",
    boxShadow:
      activeActions[spriteId] === block.type ? "0 0 10px green" : "none",
    transition: "box-shadow 0.3s ease",
  });
  const handleBlockInputChange = (spriteId, blockIndex, field, value) => {
    setSelectedSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId
          ? {
              ...sprite,
              blocks: sprite.blocks.map((block, i) =>
                i === blockIndex
                  ? {
                      ...block,
                      values: {
                        ...block.values,
                        [field]: value,
                      },
                    }
                  : block
              ),
            }
          : sprite
      )
    );
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
        {selectedSprites.map((sprite) => (
          <IndividualSpriteProvider
            key={sprite.id}
            spriteId={sprite.id}
            initialState={sprite.state}
          >
            <div
              className="mb-6 p-4 border border-gray-300 rounded bg-gray-50 shadow-sm"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, sprite.id)}
            >
              <div className="flex flex-wrap items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {sprite.name}
                </h3>
                <div className="mt-2 sm:mt-0">
                  <button
                    disabled={sprite.blocks.length === 0}
                    onClick={() => {
                      sprite.hasRun
                        ? handleReset(sprite.id)
                        : handleRun(sprite.id);
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
                {sprite.blocks.length === 0 ? (
                  <div className="text-gray-500 italic text-sm px-3 py-2 bg-gray-100 border border-dashed border-gray-300 rounded">
                    👉 Drag some actions here to get started.
                  </div>
                ) : (
                  sprite.blocks.map((block, blockIndex) => (
                    <div
                      key={blockIndex}
                      title="Click to remove"
                      className="flex flex-wrap items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-300 shadow-sm cursor-pointer transition group"
                      style={getBlockStyle(sprite.id, block)}
                    >
                      {block.type === "Move" && (
                        <>
                          <span className="mr-2">Move</span>
                          <input
                            type="number"
                            value={block.values.steps || ""}
                            placeholder="steps"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleBlockInputChange(
                                sprite.id,
                                blockIndex,
                                "steps",
                                e.target.value
                              )
                            }
                            className="border px-2 w-16 text-center mr-2"
                          />
                          <span className="mr-2">steps</span>
                        </>
                      )}
                      {block.type === "Rotate" && (
                        <>
                          <span className="mr-2">Rotate</span>
                          <input
                            type="number"
                            value={block.values.degrees || ""}
                            placeholder="degrees"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleBlockInputChange(
                                sprite.id,
                                blockIndex,
                                "degrees",
                                e.target.value
                              )
                            }
                            className="border px-2 w-16 text-center mr-2"
                          />
                          <span className="mr-2">degrees</span>
                        </>
                      )}
                      {block.type === "Say" && (
                        <>
                          <span className="mr-2">Say</span>
                          <input
                            type="text"
                            value={block.values.message || ""}
                            placeholder="message"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleBlockInputChange(
                                sprite.id,
                                blockIndex,
                                "message",
                                e.target.value
                              )
                            }
                            className="border px-2 w-24 text-center mr-2"
                          />
                          <span className="mr-2">for</span>
                          <input
                            type="number"
                            value={block.values.seconds || ""}
                            placeholder="seconds"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleBlockInputChange(
                                sprite.id,
                                blockIndex,
                                "seconds",
                                e.target.value
                              )
                            }
                            className="border px-2 w-16 text-center mr-2"
                          />
                          <span className="mr-2">sec</span>
                        </>
                      )}
                      {block.type === "Think" && (
                        <>
                          <span className="mr-2">Think</span>
                          <input
                            type="text"
                            value={block.values.message || ""}
                            placeholder="message"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleBlockInputChange(
                                sprite.id,
                                blockIndex,
                                "message",
                                e.target.value
                              )
                            }
                            className="border px-2 w-24 text-center mr-2"
                          />
                          <span className="mr-2">for</span>
                          <input
                            type="number"
                            value={block.values.seconds || ""}
                            placeholder="seconds"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleBlockInputChange(
                                sprite.id,
                                blockIndex,
                                "seconds",
                                e.target.value
                              )
                            }
                            className="border px-2 w-16 text-center mr-2"
                          />
                          <span className="mr-2">sec</span>
                        </>
                      )}
                      {block.type === "Random" && (
                        <>
                          <span className="mr-2">Move X</span>
                          <input
                            type="number"
                            value={block.values.x || ""}
                            placeholder="x"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleBlockInputChange(
                                sprite.id,
                                blockIndex,
                                "x",
                                e.target.value
                              )
                            }
                            className="border px-2 w-16 text-center mr-2"
                          />
                          <span className="mr-2">and Y</span>
                          <input
                            type="number"
                            value={block.values.y || ""}
                            placeholder="y"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleBlockInputChange(
                                sprite.id,
                                blockIndex,
                                "y",
                                e.target.value
                              )
                            }
                            className="border px-2 w-16 text-center mr-2"
                          />
                        </>
                      )}
                      {block.type === "Repeat" && (
                        <>
                          <span className="mr-2">Repeat</span>
                          <input
                            type="number"
                            value={block.values.repeat || ""}
                            placeholder="repeat"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleBlockInputChange(
                                sprite.id,
                                blockIndex,
                                "repeat",
                                e.target.value
                              )
                            }
                            className="border px-2 w-16 text-center mr-2"
                          />
                          <span className="mr-2">times</span>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlockClick(sprite.id, blockIndex);
                        }}
                        className="ml-auto text-red-600 hover:text-red-800 font-bold transition"
                        title="Remove this block"
                      >
                        Cancel
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </IndividualSpriteProvider>
        ))}
      </div>
    </div>
  );
}
