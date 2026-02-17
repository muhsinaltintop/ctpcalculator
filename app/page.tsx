"use client";

import { useState } from "react";
import InputSection from "@/components/forms/InputSection";
import GeometrySection from "@/components/forms/GeometrySection";
import FanSection from "@/components/forms/FanSection";
import ResultsSection from "@/components/forms/ResultsSection";
import { TowerInputModel } from "@/lib/models/input";

export default function Home() {
  const [input, setInput] = useState<TowerInputModel>({
    units: "SI",
    solveMode: "POWER",
    thermal: {
      waterFlow: 500,
      hotWaterTemp: 40,
      coldWaterTemp: 30,
      wetBulbTemp: 25,
      relativeHumidity: 0.6,
      altitude: 0,
    },
    geometry: {
      towerWidth: 6,
      towerLength: 6,
      fillHeight: 1.2,
      fanDiameter: 3,
      plenumHeight: 2,
    },
    fan: {
      totalEfficiency: 85,
      transmissionEfficiency: 95,
      tipClearance: 0.03,
    },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <InputSection input={input} setInput={setInput} />
        <GeometrySection input={input} setInput={setInput} />
        <FanSection input={input} setInput={setInput} />
        <ResultsSection input={input} />
      </div>
    </main>
  );
}
