  // import React, { useState } from "react";
  // import { useSprite } from "./SpriteContext";
  // import CatSprite from "./CatSprite";
  // import DogSprite from "./DogSprite";
  // export default function MidArea() {
  //   const spriteOptions = [
  //     { name: "Cat", component: CatSprite },
  //     { name: "Dog", component: DogSprite },
  //   ];
  //   const [dropdownValue, setDropdownValue] = useState("");
  //   const [selectedSprites, setSelectedSprites] = useState([]); // ✅ Correct state for multiple sprites
  //   const [blocks, setBlocks] = useState([]);
  //   const [hasRun, setHasRun] = useState(false);
  //   const { move, rotate, showMessage, setIsDraggable } = useSprite();
  //   const handleSpriteSelect = (e) => {
  //     const value = e.target.value;
  //     setDropdownValue(value);
  //     const selected = spriteOptions.find((s) => s.name === value);
  //     if (selected && !selectedSprites.includes(selected.component)) {
  //       setSelectedSprites((prev) => [...prev, selected.component]);
  //     }
  //     // Reset dropdown to allow re-selection of the same sprite later
  //     setTimeout(() => setDropdownValue(""), 0);
  //   };
  //   const handleDrop = (e) => {
  //     const blockType = e.dataTransfer.getData("blockType");
  //     setBlocks((prev) => [...prev, blockType]);
  //   };
  //   const handleBlockClick = (idx) => {
  //     setBlocks((prev) => prev.filter((_, i) => i !== idx));
  //   };
  //   const handleRun = async () => {
  //     for (let i = 0; i < blocks.length; i++) {
  //       const block = blocks[i];
  //       if (block === "repeat") {
  //         const prevBlock = blocks[i - 1];
  //         if (!prevBlock) continue;
  //         for (let j = 0; j < 10; j++) {
  //           await runBlock(prevBlock);
  //           await new Promise((res) => setTimeout(res, 100));
  //         }
  //       } else {
  //         await runBlock(block);
  //         await new Promise((res) => setTimeout(res, 300));
  //       }
  //     }
  //     setHasRun(true);
  //   };
  //   const runBlock = async (block) => {
  //     switch (block) {
  //       case "move_steps":
  //         move(10);
  //         break;
  //       case "Turn 30 degrees anti clockwise":
  //         rotate(-30);
  //         break;
  //       case "Turn 30 degrees clockwise":
  //         rotate(30);
  //         break;
  //       case "say":
  //         showMessage("saying");
  //         break;
  //       case "think":
  //         showMessage("thinking");
  //         break;
  //       case "when_sprite_clicked":
  //         setIsDraggable(true);
  //         break;
  //       default:
  //         break;
  //     }
  //   };
  //   return (
  //     <div className="flex flex-col lg:flex-row h-full bg-gray-100">
  //       {/* Script Area */}
  //       <div
  //         onDragOver={(e) => e.preventDefault()}
  //         onDrop={handleDrop}
  //         className="w-full lg:w-2/3 p-6 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto"
  //       >
  //         <div className="flex items-center justify-between mb-6">
  //           <h2 className="text-xl font-semibold text-gray-800">Script Blocks</h2>
  //           <button
  //             disabled={blocks.length === 0}
  //             onClick={() => {
  //               if (hasRun) {
  //                 setBlocks([]);
  //                 setHasRun(false);
  //               } else {
  //                 handleRun();
  //                 setHasRun(true);
  //               }
  //             }}
  //             className={`px-5 py-2 rounded font-semibold text-white transition duration-200
  //               ${
  //                 blocks.length === 0
  //                   ? "bg-gray-400 cursor-not-allowed"
  //                   : hasRun
  //                   ? "bg-red-500 hover:bg-red-600"
  //                   : "bg-green-500 hover:bg-green-600"
  //               }`}
  //           >
  //             {hasRun ? "Reset" : "Run"}
  //           </button>
  //         </div>
  //         <div className="space-y-3">
  //           {blocks.length > 0 ? (
  //             blocks.map((block, idx) => (
  //               <div
  //                 key={idx}
  //                 onClick={() => handleBlockClick(idx)}
  //                 title="Click to remove"
  //                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-300 shadow-sm cursor-pointer transition"
  //               >
  //                 {block}
  //               </div>
  //             ))
  //           ) : (
  //             <p className="text-gray-400 italic">
  //               Drag and drop blocks here to start building a script.
  //             </p>
  //           )}
  //         </div>
  //       </div>
  //       {/* Sprite Panel */}
  //       <div className="w-full lg:w-1/3 p-6 bg-gray-50">
  //         <h2 className="text-xl font-semibold text-gray-800 mb-4">
  //           Add New Sprite
  //         </h2>
  //         <select
  //           className="p-2 w-full border border-gray-300 rounded mb-6 bg-white text-gray-800"
  //           value={dropdownValue}
  //           onChange={handleSpriteSelect}
  //         >
  //           <option value="">Select a sprite</option>
  //           {spriteOptions.map((sprite) => (
  //             <option key={sprite.name} value={sprite.name}>
  //               {sprite.name}
  //             </option>
  //           ))}
  //         </select>
  //         <div className="w-full h-64 border-2 border-dashed border-red-400 rounded-lg flex items-center justify-center bg-white">
  //           {selectedSprites.length > 0 ? (
  //             <div className="flex gap-4">
  //               {selectedSprites.map(() => (
  //                 <div className="w-full h-64 border-2 border-dashed border-red-400 rounded-lg flex items-center justify-center bg-white">
  //                   {spriteOptions.name}
  //                   <h2>hhh</h2>
  //                 </div>
  //               ))}
  //             </div>
  //           ) : (
  //             <span className="text-gray-400">No sprite selected</span>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }


//   import React, { useState } from "react";
// import { useSprite } from "./SpriteContext";
// import CatSprite from "./CatSprite";
// import DogSprite from "./DogSprite";

// export default function MidArea() {
//   const spriteOptions = [
//     { name: "Cat", component: CatSprite },
//     { name: "Dog", component: DogSprite },
//   ];

//   const [dropdownValue, setDropdownValue] = useState("");
//   const [selectedSprites, setSelectedSprites] = useState([]); // [{ name, component, blocks, hasRun }]
//   const { move, rotate, showMessage, setIsDraggable } = useSprite();

//   const handleSpriteSelect = (e) => {
//     const value = e.target.value;
//     setDropdownValue(value);
//     const selected = spriteOptions.find((s) => s.name === value);
//     if (
//       selected &&
//       !selectedSprites.some((s) => s.name === selected.name)
//     ) {
//       setSelectedSprites((prev) => [
//         ...prev,
//         {
//           name: selected.name,
//           component: selected.component,
//           blocks: [],
//           hasRun: false,
//         },
//       ]);
//     }
//     setTimeout(() => setDropdownValue(""), 0);
//   };

//   const handleDrop = (e, spriteIndex) => {
//     const blockType = e.dataTransfer.getData("blockType");
//     setSelectedSprites((prev) =>
//       prev.map((sprite, idx) =>
//         idx === spriteIndex
//           ? { ...sprite, blocks: [...sprite.blocks, blockType] }
//           : sprite
//       )
//     );
//   };

//   const handleBlockClick = (spriteIndex, blockIndex) => {
//     setSelectedSprites((prev) =>
//       prev.map((sprite, idx) =>
//         idx === spriteIndex
//           ? {
//               ...sprite,
//               blocks: sprite.blocks.filter((_, i) => i !== blockIndex),
//             }
//           : sprite
//       )
//     );
//   };

//   const handleRun = async (spriteIndex) => {
//     const sprite = selectedSprites[spriteIndex];
//     for (let i = 0; i < sprite.blocks.length; i++) {
//       const block = sprite.blocks[i];
//       if (block === "repeat") {
//         const prevBlock = sprite.blocks[i - 1];
//         if (!prevBlock) continue;
//         for (let j = 0; j < 10; j++) {
//           await runBlock(prevBlock);
//           await new Promise((res) => setTimeout(res, 100));
//         }
//       } else {
//         await runBlock(block);
//         await new Promise((res) => setTimeout(res, 300));
//       }
//     }
//     setSelectedSprites((prev) =>
//       prev.map((s, idx) =>
//         idx === spriteIndex ? { ...s, hasRun: true } : s
//       )
//     );
//   };

//   const runBlock = async (block) => {
//     switch (block) {
//       case "move_steps":
//         move(10);
//         break;
//       case "Turn 30 degrees anti clockwise":
//         rotate(-30);
//         break;
//       case "Turn 30 degrees clockwise":
//         rotate(30);
//         break;
//       case "say":
//         showMessage("saying");
//         break;
//       case "think":
//         showMessage("thinking");
//         break;
//       case "when_sprite_clicked":
//         setIsDraggable(true);
//         break;
//       default:
//         break;
//     }
//   };
//   return (
//     <div className="flex flex-col lg:flex-row h-full bg-gray-100">
//       {/* Sprite Panel */}
//       <div className="w-full lg:w-1/3 p-6 bg-gray-50">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">
//           Add New Sprite
//         </h2>
//         <select
//           className="p-2 w-full border border-gray-300 rounded mb-6 bg-white text-gray-800"
//           value={dropdownValue}
//           onChange={handleSpriteSelect}
//         >
//           <option value="">Select a sprite</option>
//           {spriteOptions.map((sprite) => (
//             <option key={sprite.name} value={sprite.name}>
//               {sprite.name}
//             </option>
//           ))}
//         </select>
//         <div className="flex flex-col gap-4">
//           {selectedSprites.length > 0 ? (
//             selectedSprites.map((sprite, idx) => (
//               <div key={idx} className="flex flex-col border p-4 rounded bg-white shadow">
//                 <h3 className="font-semibold mb-2 text-lg text-center">
//                   {sprite.name}
//                 </h3>
//                 <sprite.component />
//               </div>
//             ))
//           ) : (
//             <span className="text-gray-400">No sprite selected</span>
//           )}
//         </div>
//       </div>

//       {/* Script Areas per Sprite */}
//       <div className="w-full lg:w-2/3 p-6 bg-white border-l border-gray-200 overflow-y-auto">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6">Scripts</h2>
//         {selectedSprites.length > 0 ? (
//           selectedSprites.map((sprite, spriteIndex) => (
//             <div
//               key={spriteIndex}
//               className="mb-6 p-4 border border-gray-300 rounded bg-gray-50 shadow-sm"
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={(e) => handleDrop(e, spriteIndex)}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-700">
//                   Script for {sprite.name}
//                 </h3>
//                 <button
//                   disabled={sprite.blocks.length === 0}
//                   onClick={() => {
//                     if (sprite.hasRun) {
//                       // Reset this sprite's script
//                       setSelectedSprites((prev) =>
//                         prev.map((s, idx) =>
//                           idx === spriteIndex
//                             ? { ...s, blocks: [], hasRun: false }
//                             : s
//                         )
//                       );
//                     } else {
//                       handleRun(spriteIndex);
//                     }
//                   }}
//                   className={`px-4 py-1 rounded text-white font-semibold transition ${
//                     sprite.blocks.length === 0
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : sprite.hasRun
//                       ? "bg-red-500 hover:bg-red-600"
//                       : "bg-green-500 hover:bg-green-600"
//                   }`}
//                 >
//                   {sprite.hasRun ? "Reset" : "Run"}
//                 </button>
//               </div>
//               <div className="space-y-2">
//                 {sprite.blocks.length > 0 ? (
//                   sprite.blocks.map((block, blockIndex) => (
//                     <div
//                       key={blockIndex}
//                       onClick={() =>
//                         handleBlockClick(spriteIndex, blockIndex)
//                       }
//                       title="Click to remove"
//                       className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-300 shadow-sm cursor-pointer transition"
//                     >
//                       {block}
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-400 italic">
//                     Drag and drop blocks here for {sprite.name}.
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400 italic">
//             No scripts yet. Select a sprite to get started.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import CatSprite from "./CatSprite";
// import DogSprite from "./DogSprite";

// export default function MidArea({ selectedSprites, setSelectedSprites }) 
//   {
//   const spriteOptions = [
//     { name: "Cat", component: CatSprite },
//     { name: "Dog", component: DogSprite },
//   ];

//   const [dropdownValue, setDropdownValue] = useState("");

//   const handleSpriteSelect = (e) => {
//     const value = e.target.value;
//     setDropdownValue(value);
//     const selected = spriteOptions.find((s) => s.name === value);
//     if (selected) {
//       const count = selectedSprites.filter(s => s.name === selected.name).length;
//       setSelectedSprites((prev) => [
//         ...prev,
//         {
//           id: `${selected.name}-${count + 1}`,
//           name: `${selected.name} ${count + 1}`,
//           baseName: selected.name,
//           component: selected.component,
//           blocks: [],
//           hasRun: false,
//         },
//       ]);
//     }
//     setTimeout(() => setDropdownValue(""), 0);
//   };

//   const handleDrop = (e, spriteId) => {
//     const blockType = e.dataTransfer.getData("blockType");
//     setSelectedSprites((prev) =>
//       prev.map((sprite) =>
//         sprite.id === spriteId
//           ? { ...sprite, blocks: [...sprite.blocks, blockType] }
//           : sprite
//       )
//     );
//   };

//   const handleBlockClick = (spriteId, blockIndex) => {
//     setSelectedSprites((prev) =>
//       prev.map((sprite) =>
//         sprite.id === spriteId
//           ? {
//               ...sprite,
//               blocks: sprite.blocks.filter((_, i) => i !== blockIndex),
//             }
//           : sprite
//       )
//     );
//   };

//   const handleRun = async (spriteId) => {
//     const sprite = selectedSprites.find((s) => s.id === spriteId);
//     const spriteActions = sprite.actions;
//     for (let i = 0; i < sprite.blocks.length; i++) {
//       const block = sprite.blocks[i];
//       if (block === "repeat") {
//         const prevBlock = sprite.blocks[i - 1];
//         if (!prevBlock) continue;
//         for (let j = 0; j < 10; j++) {
//           await runBlock(prevBlock, spriteActions);
//           await new Promise((res) => setTimeout(res, 100));
//         }
//       } else {
//         await runBlock(block, spriteActions);
//         await new Promise((res) => setTimeout(res, 300));
//       }
//     }
//     setSelectedSprites((prev) =>
//       prev.map((s) =>
//         s.id === spriteId ? { ...s, hasRun: true } : s
//       )
//     );
//   };

//   const runBlock = async (block, actions) => {
//     const { move, rotate, showMessage, setIsDraggable } = actions;
//     switch (block) {
//       case "move_steps":
//         move(10);
//         break;
//       case "Turn 30 degrees anti clockwise":
//         rotate(-30);
//         break;
//       case "Turn 30 degrees clockwise":
//         rotate(30);
//         break;
//       case "say":
//         showMessage("saying");
//         break;
//       case "think":
//         showMessage("thinking");
//         break;
//       case "when_sprite_clicked":
//         setIsDraggable(true);
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row h-full bg-gray-100">
//       {/* Left panel: sprite selection + script blocks */}
//       <div className="w-full lg:w-1/2 p-6 bg-white overflow-y-auto">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">
//           Add New Sprite
//         </h2>
//         <select
//           className="p-2 w-full border border-gray-300 rounded mb-6 bg-white text-gray-800"
//           value={dropdownValue}
//           onChange={handleSpriteSelect}
//         >
//           <option value="">Select a sprite</option>
//           {spriteOptions.map((sprite) => (
//             <option key={sprite.name} value={sprite.name}>
//               {sprite.name}
//             </option>
//           ))}
//         </select>

//         {/* Script editor per sprite */}
//         {selectedSprites.length > 0 ? (
//           selectedSprites.map((sprite) => (
//             <div
//               key={sprite.id}
//               className="mb-6 p-4 border border-gray-300 rounded bg-gray-50 shadow-sm"
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={(e) => handleDrop(e, sprite.id)}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-700">
//                   Script for {sprite.name}
//                 </h3>
//                 <button
//                   disabled={sprite.blocks.length === 0}
//                   onClick={() => {
//                     if (sprite.hasRun) {
//                       setSelectedSprites((prev) =>
//                         prev.map((s) =>
//                           s.id === sprite.id
//                             ? { ...s, blocks: [], hasRun: false }
//                             : s
//                         )
//                       );
//                     } else {
//                       handleRun(sprite.id);
//                     }
//                   }}
//                   className={`px-4 py-1 rounded text-white font-semibold transition ${
//                     sprite.blocks.length === 0
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : sprite.hasRun
//                       ? "bg-red-500 hover:bg-red-600"
//                       : "bg-green-500 hover:bg-green-600"
//                   }`}
//                 >
//                   {sprite.hasRun ? "Reset" : "Run"}
//                 </button>
//               </div>
//               <div className="space-y-2">
//                 {sprite.blocks.length > 0 ? (
//                   sprite.blocks.map((block, blockIndex) => (
//                     <div
//                       key={blockIndex}
//                       onClick={() =>
//                         handleBlockClick(sprite.id, blockIndex)
//                       }
//                       title="Click to remove"
//                       className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-300 shadow-sm cursor-pointer transition"
//                     >
//                       {block}
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-400 italic">
//                     Drag and drop blocks here for {sprite.name}.
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400 italic">
//             No scripts yet. Select a sprite to get started.
//           </p>
//         )}
//       </div>

//     </div>
//   );
// }


import React, { useState } from "react";

import CatSprite from "./CatSprite";
import DogSprite from "./DogSprite";

export default function MidArea({ selectedSprites, setSelectedSprites }) {
  const spriteOptions = [
    { name: "Cat", component: CatSprite },
    { name: "Dog", component: DogSprite },
  ];

  const [dropdownValue, setDropdownValue] = useState("");

  // Add a new sprite to the stage
  const handleSpriteSelect = (e) => {
    const value = e.target.value;
    if (!value) return;
    
    setDropdownValue(value);
    const selected = spriteOptions.find((s) => s.name === value);
    
    if (selected) {
      const count = selectedSprites.filter(s => s.baseName === selected.name).length;
      // Create a new sprite with random initial position
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
          state: {
            position: { x: randomX, y: randomY },
            rotation: 0,
            isDraggable: false
          }
        },
      ]);
    }
    // Reset dropdown after selection
    setTimeout(() => setDropdownValue(""), 0);
  };

  // Handle dropping a block onto a sprite's script area
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

  // Remove a block when clicked
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

  // Run the sprite's script blocks
  const handleRun = async (spriteId) => {
    const sprite = selectedSprites.find((s) => s.id === spriteId);
    if (!sprite || !sprite.actionRef) return;
    
    const actions = sprite.actionRef;
    
    for (let i = 0; i < sprite.blocks.length; i++) {
      const block = sprite.blocks[i];
      if (block === "repeat") {
        const prevBlock = sprite.blocks[i - 1];
        if (!prevBlock) continue;
        for (let j = 0; j < 10; j++) {
          await executeBlock(prevBlock, actions);
          await new Promise(res => setTimeout(res, 100));
        }
      } else {
        await executeBlock(block, actions);
        await new Promise(res => setTimeout(res, 300));
      }
    }
    
    // Mark sprite as having run its script
    setSelectedSprites(prev =>
      prev.map(s => s.id === spriteId ? { ...s, hasRun: true } : s)
    );
  };

  // Execute a single block using the sprite's actions
  const executeBlock = async (block, actions) => {
    const { move, rotate, showMessage, setIsDraggable } = actions;
    
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

        {/* Script editor for each sprite */}
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
                <button
                  disabled={sprite.blocks.length === 0}
                  onClick={() => {
                    if (sprite.hasRun) {
                      setSelectedSprites((prev) =>
                        prev.map((s) =>
                          s.id === sprite.id
                            ? { ...s, blocks: [], hasRun: false }
                            : s
                        )
                      );
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
              <div className="space-y-2">
                {sprite.blocks.length > 0 ? (
                  sprite.blocks.map((block, blockIndex) => (
                    <div
                      key={blockIndex}
                      onClick={() => handleBlockClick(sprite.id, blockIndex)}
                      title="Click to remove"
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-300 shadow-sm cursor-pointer transition"
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


