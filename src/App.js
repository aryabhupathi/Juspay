
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import { IndividualSpriteProvider, SpriteProvider } from "./components/SpriteContext";
export default function App() {
  const [selectedSprites, setSelectedSprites] = useState([]);
  return (
    <SpriteProvider>
      <div className="bg-blue-100 pt-6 font-sans h-screen">
        <div className="h-full flex flex-row gap-2 px-2">
          <div className="w-1/5 h-full bg-white border border-gray-200 rounded-xl">
            <Sidebar />
          </div>
          <div className="flex-1 h-full bg-white border border-gray-200 rounded-xl">
          <IndividualSpriteProvider>
            <MidArea
              selectedSprites={selectedSprites}
              setSelectedSprites={setSelectedSprites}
            /></IndividualSpriteProvider>
          </div>
          <div className="w-1/3 h-full bg-white border border-gray-200 rounded-xl">
            <PreviewArea
              selectedSprites={selectedSprites}
              setSelectedSprites={setSelectedSprites}
            />
          </div>
        </div>
      </div>
    </SpriteProvider>
  );
}
