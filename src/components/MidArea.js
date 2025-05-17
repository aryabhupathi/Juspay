import React, { useState, useEffect, useCallback } from "react";
import { useSprite } from "../context/SpriteContext";
import CatSprite from "../components/sprites/CatSprite";
import DogSprite from "../components/sprites/DogSprite";
import BallSprite from "../components/sprites/BallSprite";
import { IndividualSpriteProvider } from "../context/ActionContext";
import { GiCancel } from "react-icons/gi";
export default function MidArea({ selectedSprites, setSelectedSprites }) {
  const spriteOptions = [
    { name: "Cat", component: CatSprite },
    { name: "Dog", component: DogSprite },
    { name: "Ball", component: BallSprite },
  ];
  const [dropdownValue, setDropdownValue] = useState("");
  const { startAction, clearAction, activeActions, spritePositions } =
    useSprite();
  const [swappedPairs, setSwappedPairs] = useState(new Set());
  useEffect(() => {
    checkCollision();
  }, [spritePositions]);
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
  const VERTICALHEIGHT = 80;
  const handleSpriteSelect = (e) => {
    const value = e.target.value;
    if (!value) return;
    setDropdownValue(value);
    const selected = spriteOptions.find((s) => s.name === value);
    if (selected) {
      const count = selectedSprites.filter(
        (s) => s.baseName === selected.name
      ).length;
      const yPosition = count * VERTICALHEIGHT;
      const randomX = Math.floor(Math.random() * 150) + 50;
      const newSprite = {
        id: `${selected.name}-${count + 1}`,
        name: `${selected.name} ${count + 1}`,
        baseName: selected.name,
        component: selected.component,
        blocks: [],
        hasRun: false,
        currentBlockIndex: 0,
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
      .filter((sprite) => sprite.blocks?.length > 0 && !sprite.hasRun)
      .map((sprite) => handleRun(sprite.id));
    Promise.all(promises).catch((err) =>
      console.error("Error running sprites:", err)
    );
  };
  const runBlocks = async (blocks, spriteId, actions, startIndex = 0) => {
    if (!blocks || !Array.isArray(blocks)) return;
    for (let i = startIndex; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.type === "Repeat") {
        const repeatTimes = Number(block.values.repeat);
        const prevBlock = blocks[i - 1];
        if (!prevBlock) continue;
        for (let j = 0; j < repeatTimes; j++) {
          startAction(spriteId, prevBlock.type);
          await runBlock(prevBlock, actions);
          clearAction(spriteId);
          selectedSprites.forEach((otherSprite) => {
            if (otherSprite.id !== spriteId) {
              checkCollision(spriteId, otherSprite.id);
            }
          });
          await new Promise((res) => setTimeout(res, 300));
        }
        setSelectedSprites((prev) =>
          prev.map((s) =>
            s.id === spriteId ? { ...s, currentBlockIndex: i + 1 } : s
          )
        );
        continue;
      }
      startAction(spriteId, block.type);
      await runBlock(block, actions);
      clearAction(spriteId);
      if (block.type === "Move" || block.type === "Random") {
        selectedSprites.forEach((otherSprite) => {
          if (otherSprite.id !== spriteId) {
            checkCollision(spriteId, otherSprite.id);
          }
        });
      }
      await new Promise((res) => setTimeout(res, 300));
      setSelectedSprites((prev) =>
        prev.map((s) =>
          s.id === spriteId ? { ...s, currentBlockIndex: i + 1 } : s
        )
      );
    }
  };
  const runBlock = async (block, actions) => {
    const { moveX, moveY, rotate, say, think, randomXY } = actions;
    const { type, values = {} } = block;
    switch (type) {
      case "MoveX":
        moveX(Number(values.steps));
        break;
      case "MoveY":
        moveY(Number(values.steps));
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
      case "Random":
        randomXY(Number(values.x), Number(values.y));
        break;
      default:
        console.warn("Unknown block type:", type);
        break;
    }
  };
  const handleReset = (spriteId) => {
    const sprite = selectedSprites.find((s) => s.id === spriteId);
    if (!sprite || !sprite.actionRef) return;
    sprite.actionRef.reset();
    setSelectedSprites((prev) =>
      prev.map((s) =>
        s.id === spriteId
          ? { ...s, blocks: [], hasRun: false, currentBlockIndex: 0 }
          : s
      )
    );
  };

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
    setSelectedSprites((prev) =>
      prev.map((s) => (s.id === spriteId ? { ...s, hasRun: true } : s))
    );
    await runBlocks(
      sprite.blocks,
      spriteId,
      actions,
      sprite.currentBlockIndex || 0
    );
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
        {selectedSprites.length === 0 && (
          <div className="mb-6 p-4 border border-gray-300 rounded bg-yellow-50 shadow-sm">
            <p>Select a sprite to continue</p>
          </div>
        )}
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
              {sprite.blocks.length === 0 && (
                <div className="mb-6 p-4 border border-gray-300 rounded bg-yellow-50 shadow-sm">
                  <p>Drag actions to continue</p>
                </div>
              )}
              {sprite.blocks.map((block, blockIndex) => (
                <div
                  key={blockIndex}
                  title="Click to remove"
                  className="flex flex-wrap items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-300 shadow-sm cursor-pointer transition group"
                  style={{
                    border:
                      activeActions[sprite.id] === block.type
                        ? "2px solid green"
                        : "none",
                    boxShadow:
                      activeActions[sprite.id] === block.type
                        ? "0 0 10px green"
                        : "none",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  {block.type === "MoveX" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Move X by</span>
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
                        className="border w-full sm:w-16 text-center"
                      />
                    </div>
                  )}
                  {block.type === "MoveY" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Move Y by</span>
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
                        className="border w-full sm:w-16 text-center"
                      />
                    </div>
                  )}
                  {block.type === "Rotate" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Rotate</span>
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
                        className="border w-full sm:w-16 text-center"
                      />
                      <span>degrees</span>
                    </div>
                  )}
                  {block.type === "Say" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Say</span>
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
                        className="border w-full sm:w-20 text-center"
                      />
                      <span>for</span>
                      <input
                        type="number"
                        value={block.values.seconds || ""}
                        placeholder="sec"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleBlockInputChange(
                            sprite.id,
                            blockIndex,
                            "seconds",
                            e.target.value
                          )
                        }
                        className="border w-full sm:w-16 text-center"
                      />
                      <span>sec</span>
                    </div>
                  )}
                  {block.type === "Think" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Think</span>
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
                        className="border w-full sm:w-20 text-center"
                      />
                      <span>for</span>
                      <input
                        type="number"
                        value={block.values.seconds || ""}
                        placeholder="sec"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleBlockInputChange(
                            sprite.id,
                            blockIndex,
                            "seconds",
                            e.target.value
                          )
                        }
                        className="border w-full sm:w-16 text-center"
                      />
                      <span>sec</span>
                    </div>
                  )}
                  {block.type === "Random" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Move randomly by X:</span>
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
                        className="border w-full sm:w-16 text-center"
                      />
                      <span>and Y:</span>
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
                        className="border w-full sm:w-16 text-center"
                      />
                    </div>
                  )}
                  {block.type === "ChangeColor" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Change color effect by</span>
                      <input
                        type="number"
                        value={block.values.amount || ""}
                        placeholder="amount"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleBlockInputChange(
                            sprite.id,
                            blockIndex,
                            "amount",
                            e.target.value
                          )
                        }
                        className="border w-full sm:w-16 text-center"
                      />
                    </div>
                  )}
                  {block.type === "Repeat" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Repeat</span>
                      <input
                        type="number"
                        value={block.values.repeat || ""}
                        placeholder="times"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleBlockInputChange(
                            sprite.id,
                            blockIndex,
                            "repeat",
                            e.target.value
                          )
                        }
                        className="border w-full sm:w-16 text-center"
                      />
                      <span>times</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlockClick(sprite.id, blockIndex);
                    }}
                    className="ml-auto text-red-600 hover:text-red-800 font-bold transition"
                    title="Remove this block"
                  >
                    <GiCancel />
                  </button>
                </div>
              ))}
            </div>
          </IndividualSpriteProvider>
        ))}
      </div>
    </div>
  );
}
