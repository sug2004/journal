"use client";
import { useState } from "react";

export default function ProfileTabs({ onSelect }: { onSelect: (tab: string) => void }) {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = ["General"];

  return (
    <div className="flex overflow-x-auto rounded-lg bg-white shadow-sm text-sm">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => {
            setActiveTab(tab);
            onSelect(tab);
          }}
          className={`flex-1 py-2 px-4 ${
            activeTab === tab ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
