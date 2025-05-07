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
const ActionsExporter = React.forwardRef(({ children }, ref) => {
  const { move, rotate, showMessage, setIsDraggable } = useSprite();
  useEffect(() => {
    if (ref) {
      ref.current = { move, rotate, showMessage, setIsDraggable };
    }
  }, [move, rotate, showMessage, setIsDraggable, ref]);
  return <>{children}</>;
});