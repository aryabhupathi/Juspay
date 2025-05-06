// import React from "react";
// import CatSprite from "./CatSprite";
// export default function PreviewArea() {
//   return (
//     <div className="flex-none h-full overflow-y-auto p-2">
//       <CatSprite />
//     </div>
//   );
// }

// PreviewArea.js
// import React from "react";
// import { SpriteProvider } from "./SpriteContext";

// export default function PreviewArea({ sprites }) {
//   return (
//     <div className="relative h-full w-full bg-gray-100 overflow-hidden p-4">
//       {sprites.map((sprite, idx) => {
//         const SpriteComponent = sprite.component;
//         return (
//           <SpriteProvider key={idx}>
//             <SpriteComponent />
//           </SpriteProvider>
//         );
//       })}
//     </div>
//   );
// }


// import React from "react";
// import { SpriteProvider, useSprite } from "./SpriteContext";

// export default function PreviewArea({ sprites }) {
//   return (
//     <div className="relative h-full w-full bg-gray-100 overflow-hidden p-4">
//       {sprites.map((sprite, idx) => {
//         const SpriteWrapper = () => {
//           const { move, rotate, showMessage, setIsDraggable } = useSprite();

//           // attach sprite actions
//           sprite.actions = {
//             move,
//             rotate,
//             showMessage,
//             setIsDraggable,
//           };

//           const SpriteComponent = sprite.component;
//           return <SpriteComponent />;
//         };

//         return (
//           <SpriteProvider key={sprite.id}>
//             <SpriteWrapper />
//           </SpriteProvider>
//         );
//       })}
//     </div>
//   );
// }


import React, { useRef, useEffect } from "react";
import { SpriteProvider, useSprite } from "./SpriteContext";

export default function PreviewArea({ selectedSprites, setSelectedSprites }) {
  return (
    <div className="relative h-full w-full bg-gray-100 overflow-hidden p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview Area</h2>
      
      {selectedSprites.map((sprite) => (
        <SpriteWrapper 
          key={sprite.id} 
          sprite={sprite} 
          setSelectedSprites={setSelectedSprites}
        />
      ))}
    </div>
  );
}

function SpriteWrapper({ sprite, setSelectedSprites }) {
  const SpriteComponent = sprite.component;
  const actionsRef = useRef(null);
  
  useEffect(() => {
    // Update the parent component with this sprite's action references
    setSelectedSprites(prev => 
      prev.map(s => s.id === sprite.id ? { ...s, actionRef: actionsRef.current } : s)
    );
  }, [sprite.id, setSelectedSprites]);
  
  return (
    <SpriteProvider initialState={sprite.state}>
      <ActionsExporter ref={actionsRef}>
        <SpriteComponent />
      </ActionsExporter>
    </SpriteProvider>
  );
}

// Simple component to export sprite actions via ref
const ActionsExporter = React.forwardRef(({ children }, ref) => {
  const { move, rotate, showMessage, setIsDraggable } = useSprite();
  
  useEffect(() => {
    if (ref) {
      ref.current = { move, rotate, showMessage, setIsDraggable };
    }
  }, [move, rotate, showMessage, setIsDraggable, ref]);
  
  return <>{children}</>;
});