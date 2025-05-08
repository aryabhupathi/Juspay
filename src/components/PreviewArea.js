import React, { useRef, useEffect } from "react";
import {
  useIndividualSprite,
  IndividualSpriteProvider,
} from "../context/ActionContext";
export default function PreviewArea({ selectedSprites, setSelectedSprites }) {
  return (
    <div className="relative w-full h-full overflow-y-auto p-4 bg-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview Area</h2>
      <div className="relative w-full">
        {selectedSprites.map((sprite, index) => (
          <SpriteWrapper
            key={sprite.id}
            sprite={sprite}
            index={index}
            setSelectedSprites={setSelectedSprites}
          />
        ))}
      </div>
    </div>
  );
}
function SpriteWrapper({ sprite, index, setSelectedSprites }) {
  const SpriteComponent = sprite.component;
  const actionsRef = useRef(null);
  const VERTICAL_SPACING = 150;
  const initialState = {
    ...sprite.state,
    position: { x: 0, y: index * VERTICAL_SPACING },
  };
  useEffect(() => {
    setSelectedSprites((prev) =>
      prev.map((s) =>
        s.id === sprite.id ? { ...s, actionRef: actionsRef.current } : s
      )
    );
  }, [sprite.id, setSelectedSprites]);
  return (
    <IndividualSpriteProvider initialState={initialState}>
      <ActionsExporter ref={actionsRef}>
        <SpriteComponent style={{ marginTop: "100px" }} />
      </ActionsExporter>
    </IndividualSpriteProvider>
  );
}
const ActionsExporter = React.forwardRef(({ children }, ref) => {
  const { move, rotate, showMessage, say, think, reset, randomXY } =
    useIndividualSprite();
  useEffect(() => {
    if (ref) {
      ref.current = {
        move,
        rotate,
        showMessage,
        say,
        think,
        reset,
        randomXY,
      };
    }
  }, [move, rotate, showMessage, say, think, reset, ref, randomXY]);
  return <>{children}</>;
});
